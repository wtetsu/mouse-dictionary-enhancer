/**
 * Mouse Dictionary iframe support(https://github.com/wtetsu/mouse-dictionary-iframe/)
 * Copyright 2019-present wtetsu
 * Licensed under MIT
 */

const insertStaticScript = (scriptFile: string) => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(`scripts/${scriptFile}`);
  document.head.appendChild(script);
};

chrome.runtime.sendMessage({ type: "toHtmlMode" }, insertStaticScript);
