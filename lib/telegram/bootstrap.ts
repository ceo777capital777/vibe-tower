import { TELEGRAM_BG, TELEGRAM_SDK_URL, TELEGRAM_SESSION_FLAG } from "./constants";

/**
 * Inline bootstrap. In a normal browser it returns immediately and does not
 * request telegram.org. Inside a Mini App it injects the official SDK during
 * HTML parse, then calls ready/expand and paints the dark chrome.
 */
export const telegramBootstrap = `(function () {
  try {
    var flag = ${JSON.stringify(TELEGRAM_SESSION_FLAG)};
    var sdk = ${JSON.stringify(TELEGRAM_SDK_URL)};
    var bg = ${JSON.stringify(TELEGRAM_BG)};
    var hash = "";
    var search = "";
    try { hash = String(location.hash || ""); } catch (e) {}
    try { search = String(location.search || ""); } catch (e) {}
    var params = hash + "&" + search;
    var launch = params.indexOf("tgWebAppData=") !== -1 || params.indexOf("tgWebAppPlatform=") !== -1 || params.indexOf("tgWebAppVersion=") !== -1;
    var native = typeof window.TelegramWebviewProxy !== "undefined" || typeof window.TelegramWebviewProxyProto !== "undefined";
    var ios = false;
    try { ios = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.TelegramWebview); } catch (e) {}
    var stored = false;
    try { stored = sessionStorage.getItem(flag) === "1"; } catch (e) {}
    if (!launch && !native && !ios && !stored) return;
    try { sessionStorage.setItem(flag, "1"); } catch (e) {}
    var open = "<" + "script";
    var close = "<" + "/script>";
    document.write(open + ' src="' + sdk + '">' + close);
    document.write(open + ">" +
      "try{" +
      "var native=typeof TelegramWebviewProxy!=='undefined'||typeof TelegramWebviewProxyProto!=='undefined';" +
      "var ios=false;try{ios=!!(webkit&&webkit.messageHandlers&&webkit.messageHandlers.TelegramWebview);}catch(e){}" +
      "var w=window.Telegram&&window.Telegram.WebApp;if(!w)return;" +
      "var inside=!!(w.initData&&w.initData.length)||(w.platform&&w.platform!=='unknown')||native||ios;" +
      "if(!inside)return;" +
      "try{w.setHeaderColor(" + JSON.stringify(bg) + ");}catch(e){try{w.setHeaderColor('bg_color');}catch(e2){}}" +
      "try{w.setBackgroundColor(" + JSON.stringify(bg) + ");}catch(e){}" +
      "try{if(w.setBottomBarColor)w.setBottomBarColor(" + JSON.stringify(bg) + ");}catch(e){}" +
      "try{w.expand();}catch(e){}" +
      "try{w.ready();}catch(e){}" +
      "}catch(e){}" +
      close);
  } catch (e) {}
})();`;
