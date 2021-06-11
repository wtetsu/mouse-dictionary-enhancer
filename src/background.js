/**
 * Mouse Dictionary iframe support(https://github.com/wtetsu/mouse-dictionary-iframe/)
 * Copyright 2019-present wtetsu
 * Licensed under MIT
 */

const main = async () => {
  let _active = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "isActive") {
      sendResponse({ isActive: _active });
    }
  });

  chrome.browserAction.onClicked.addListener(() => {
    _active = !_active;
    sendMessageToContents(_active);
    updateIcons(_active);
  });

  chrome.tabs.onActivated.addListener(() => {
    sendMessageToContents(_active);
  });
};

const sendMessageToContents = active => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      chrome.tabs.sendMessage(tab.id, { active });
    }
  });
};

const updateIcons = active => {
  const postfix = active ? "" : "_off";
  const newIcon = {
    path: {
      16: `icon16${postfix}.png`,
      48: `icon48${postfix}.png`,
      128: `icon128${postfix}.png`
    }
  };
  chrome.browserAction.setIcon(newIcon);
};

main();
