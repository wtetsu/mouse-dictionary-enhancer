import atcursor from "./atcursor";

if (window !== window.parent) {
  let _selection = null;
  let _mouseDown = false;
  let _isLastMouseUpOnTheWindow = false;

  const extensionId = "dnclbikcihnpjohihfcmmldgkjnebgnj";

  var port = chrome.runtime.connect(extensionId);

  document.body.addEventListener("mousedown", () => {
    _mouseDown = true;
  });

  document.body.addEventListener("mouseup", e => {
    port.postMessage({ type: "mouseup" });

    _mouseDown = false;
    _selection = window.getSelection().toString();
    if (_selection) {
      const SELECTION_LENGTH_LIMIT = 128;
      const text = _selection.trim().substring(0, SELECTION_LENGTH_LIMIT);
      port.postMessage({ type: "text", text: text, mustIncludeOriginalText: true, enableShortWord: false });
    }
  });

  document.body.addEventListener("mousemove", e => {
    if (_mouseDown) {
      return;
    }
    if (_isLastMouseUpOnTheWindow && _selection) {
      return;
    }
    if (!_isLastMouseUpOnTheWindow && window.getSelection().toString()) {
      return;
    }
    const textAtCursor = atcursor(e.target, e.clientX, e.clientY, 8);
    if (!textAtCursor) {
      return;
    }
    port.postMessage({ type: "text", text: textAtCursor, mustIncludeOriginalText: false, enableShortWord: true });
  });
}
