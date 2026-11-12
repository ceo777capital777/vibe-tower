import { TELEGRAM_BG, TELEGRAM_SESSION_FLAG } from "./constants";

const LAUNCH_MARKERS = ["tgWebAppData=", "tgWebAppPlatform=", "tgWebAppVersion="] as const;

export interface TelegramSafeArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TelegramBackButton {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface TelegramWebApp {
  initData: string;
  platform: string;
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  safeAreaInset?: TelegramSafeArea;
  contentSafeAreaInset?: TelegramSafeArea;
  BackButton?: TelegramBackButton;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
    TelegramWebviewProxy?: unknown;
    TelegramWebviewProxyProto?: unknown;
    webkit?: { messageHandlers?: { TelegramWebview?: unknown } };
  }
}

const INSET_EVENTS = ["safeAreaChanged", "contentSafeAreaChanged", "viewportChanged", "fullscreenChanged"] as const;

export function getWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function hasTelegramNativeBridge(): boolean {
  if (typeof window === "undefined") return false;
  if (window.TelegramWebviewProxy !== undefined || window.TelegramWebviewProxyProto !== undefined) return true;
  try {
    return Boolean(window.webkit?.messageHandlers?.TelegramWebview);
  } catch {
    return false;
  }
}

/** The bootstrap only injects the SDK for a real launch, so a normal visit does not poll for it. */
export function shouldWaitForSdk(): boolean {
  if (typeof window === "undefined") return false;
  if (hasTelegramNativeBridge()) return true;
  const blob = `${window.location.hash}&${window.location.search}`;
  if (LAUNCH_MARKERS.some((marker) => blob.includes(marker))) return true;
  try {
    return sessionStorage.getItem(TELEGRAM_SESSION_FLAG) === "1";
  } catch {
    return false;
  }
}

/** True only after the official SDK is loaded inside a Telegram Mini App. */
export function isTelegramMiniApp(wa: TelegramWebApp | null = getWebApp()): boolean {
  if (!wa) return false;
  if (hasTelegramNativeBridge()) return true;
  if (typeof wa.initData === "string" && wa.initData.length > 0) return true;
  return typeof wa.platform === "string" && wa.platform.length > 0 && wa.platform !== "unknown";
}

function insetPx(wa: TelegramWebApp, edge: keyof TelegramSafeArea): number {
  const device = Number(wa.safeAreaInset?.[edge] ?? 0);
  const chrome = Number(wa.contentSafeAreaInset?.[edge] ?? 0);
  const total = (Number.isFinite(device) ? device : 0) + (Number.isFinite(chrome) ? chrome : 0);
  return Math.max(0, Math.round(total));
}

/** Device safe area and Telegram chrome are independent; both are applied. */
export function applyTelegramInsets(wa: TelegramWebApp) {
  const root = document.documentElement;
  root.style.setProperty("--vt-safe-top", `${insetPx(wa, "top")}px`);
  root.style.setProperty("--vt-safe-right", `${insetPx(wa, "right")}px`);
  root.style.setProperty("--vt-safe-bottom", `${insetPx(wa, "bottom")}px`);
  root.style.setProperty("--vt-safe-left", `${insetPx(wa, "left")}px`);
}

export function applyTelegramChrome(wa: TelegramWebApp) {
  try {
    wa.setHeaderColor(TELEGRAM_BG);
  } catch {
    try {
      wa.setHeaderColor("bg_color");
    } catch {
      /* Older clients only accept theme keys. */
    }
  }
  try {
    wa.setBackgroundColor(TELEGRAM_BG);
  } catch {
    /* Background color is unavailable on very old clients. */
  }
  try {
    wa.setBottomBarColor?.(TELEGRAM_BG);
  } catch {
    /* Bottom bar color arrived in Bot API 7.10. */
  }
  try {
    wa.expand();
  } catch {
    /* expand is a no-op outside a WebView. */
  }
  try {
    wa.ready();
  } catch {
    /* ready is a no-op outside a WebView. */
  }
}

export function subscribeTelegramInsets(wa: TelegramWebApp, onChange: () => void) {
  for (const event of INSET_EVENTS) wa.onEvent(event, onChange);
  return () => {
    for (const event of INSET_EVENTS) wa.offEvent(event, onChange);
  };
}

function isTelegramHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "t.me" || host === "telegram.me";
}

/**
 * Opens an external URL through Telegram when a Mini App is active.
 * Returns false in a normal browser so the anchor keeps its default behavior.
 */
export function openExternal(url: string): boolean {
  const wa = getWebApp();
  if (!wa || !isTelegramMiniApp(wa)) return false;
  let parsed: URL;
  try {
    parsed = new URL(url, window.location.href);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  if (parsed.origin === window.location.origin) return false;
  try {
    if (isTelegramHost(parsed.hostname)) wa.openTelegramLink(parsed.href);
    else wa.openLink(parsed.href);
    return true;
  } catch {
    return false;
  }
}

export function clearTelegramSessionFlag() {
  try {
    sessionStorage.removeItem(TELEGRAM_SESSION_FLAG);
  } catch {
    /* Private mode can block sessionStorage. */
  }
}

/** Parent route used when Telegram Back is pressed on a direct entry with no in-app history. */
export function parentPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  parts.pop();
  return `/${parts.join("/")}`;
}

/** Silent check. Public pages stay available when the token is unset or the network fails. */
export function reportInitData(initData: string) {
  if (!initData) return;
  void fetch("/api/telegram/webapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
    keepalive: true,
  }).catch(() => {
    /* The platform is public; validation must not block it. */
  });
}
