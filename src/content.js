/**
 * Mouse Dictionary iframe support(https://github.com/wtetsu/mouse-dictionary-iframe/)
 * Copyright 2019-present wtetsu
 * Licensed under MIT
 */

import atcursor from "./lib/atcursor";

const main = () => {
  if (window === window.parent) {
    return;
  }
  let _active = true;
  let _selection = null;
  let _mouseDown = false;
  let _isLastMouseUpOnTheWindow = false;

  document.body.addEventListener("mousedown", () => {
    if (!_active) {
      return;
    }
    _mouseDown = true;
  });

  document.body.addEventListener("mouseup", () => {
    if (!_active) {
      return;
    }
    chrome.runtime.sendMessage(MD_EXTENSION_ID, { type: "mouseup" });
    _mouseDown = false;
    _selection = window.getSelection().toString();
    if (_selection) {
      const SELECTION_LENGTH_LIMIT = 128;
      const text = _selection.trim().substring(0, SELECTION_LENGTH_LIMIT);
      chrome.runtime.sendMessage(MD_EXTENSION_ID, {
        type: "text",
        text: text,
        mustIncludeOriginalText: true,
        enableShortWord: false
      });
    }
  });

  document.body.addEventListener("mousemove", e => {
    if (!_active) {
      return;
    }
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
    chrome.runtime.sendMessage(MD_EXTENSION_ID, {
      type: "text",
      text: textAtCursor,
      mustIncludeOriginalText: false,
      enableShortWord: true
    });
  });

  chrome.runtime.onMessage.addListener(request => {
    const active = request.message.active;
    if (typeof active === "boolean") {
      _active = active;
    }
  });
};

main();
