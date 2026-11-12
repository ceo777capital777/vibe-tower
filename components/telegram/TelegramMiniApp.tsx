"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { closeSearch, isSearchDialogOpen } from "@/components/search/SearchDialog";
import {
  applyTelegramChrome,
  applyTelegramInsets,
  clearTelegramSessionFlag,
  getWebApp,
  isTelegramMiniApp,
  parentPath,
  reportInitData,
  shouldWaitForSdk,
  subscribeTelegramInsets,
  type TelegramBackButton,
} from "@/lib/telegram/client";

/**
 * Activates Mini App behavior after the official SDK is present.
 * In a normal browser the SDK is not loaded, this component changes nothing,
 * and safe-area variables stay at 0.
 */
export function TelegramMiniApp() {
  const pathname = usePathname();
  const router = useRouter();
  const stack = useRef<string[]>([]);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};
    let timer = 0;
    let stop = 0;

    const boot = () => {
      if (cancelled) return true;
      const wa = getWebApp();
      if (!wa) return false;
      if (!isTelegramMiniApp(wa)) {
        clearTelegramSessionFlag();
        return true;
      }
      document.documentElement.classList.add("tg-mini-app");
      applyTelegramChrome(wa);
      applyTelegramInsets(wa);
      unsubscribe = subscribeTelegramInsets(wa, () => applyTelegramInsets(wa));
      reportInitData(wa.initData);
      return true;
    };

    if (!boot() && shouldWaitForSdk()) {
      timer = window.setInterval(() => {
        if (boot()) window.clearInterval(timer);
      }, 40);
      stop = window.setTimeout(() => window.clearInterval(timer), 4000);
    }

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearTimeout(stop);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    const history = stack.current;
    if (history.length === 0) history.push(pathname);
    else if (history[history.length - 1] !== pathname) {
      if (history.length > 1 && history[history.length - 2] === pathname) history.pop();
      else history.push(pathname);
    }

    const button = getWebApp()?.BackButton;
    if (!button || !document.documentElement.classList.contains("tg-mini-app")) return;
    if (pathname !== "/" || history.length > 1) button.show();
    else button.hide();
  }, [pathname]);

  useEffect(() => {
    let button: TelegramBackButton | null = null;
    let timer = 0;
    let stop = 0;

    const onBack = () => {
      if (isSearchDialogOpen()) {
        closeSearch();
        return;
      }
      const history = stack.current;
      const path = pathnameRef.current;
      if (history.length > 1) {
        router.back();
        return;
      }
      const parent = parentPath(path);
      if (parent === path) return;
      history[0] = parent;
      router.push(parent);
    };

    const bind = () => {
      if (button) return true;
      const next = getWebApp()?.BackButton;
      if (!next || !document.documentElement.classList.contains("tg-mini-app")) return false;
      next.onClick(onBack);
      button = next;
      if (pathnameRef.current !== "/" || stack.current.length > 1) next.show();
      else next.hide();
      return true;
    };

    if (!bind() && shouldWaitForSdk()) {
      timer = window.setInterval(() => {
        if (bind()) window.clearInterval(timer);
      }, 50);
      stop = window.setTimeout(() => window.clearInterval(timer), 4000);
    }

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
      button?.offClick(onBack);
    };
  }, [router]);

  return null;
}
