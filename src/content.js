import atcursor from "./atcursor";

if (window !== window.parent) {
  const extensionId = "konjoaojaikeomiamkphdchgfalibjhb";
  var port = chrome.runtime.connect(extensionId);

  document.body.addEventListener("mousemove", ev => {
    const textAtCursor = atcursor(ev.target, ev.clientX, ev.clientY, 8);
    if (textAtCursor) {
      port.postMessage({ text: textAtCursor });
    }
  });
}
