/**
 * Mouse Dictionary Enhancer(https://github.com/wtetsu/mouse-dictionary-enhancer/)
 * Copyright 2019-present wtetsu
 * Licensed under MIT
 */

const insertStaticScript = (scriptFile: string) => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(`scripts/${scriptFile}`);
  document.head.appendChild(script);
};

chrome.runtime.sendMessage({ type: "toHtmlMode" }, insertStaticScript);
