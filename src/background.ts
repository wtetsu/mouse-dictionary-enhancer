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

  chrome.action.onClicked.addListener(() => {
    _active = !_active;
    sendMessageToContents(_active);
    updateIcons(_active);
  });

  chrome.tabs.onActivated.addListener(() => {
    // Workaround "Tabs cannot be edited right now (user may be dragging a tab)" error
    setTimeout(() => {
      sendMessageToContents(_active);
    }, 100);
  });
};

const sendMessageToContents = (active: boolean) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (tab.id === undefined) {
        continue;
      }
      chrome.tabs.sendMessage(tab.id, { active });
    }
  });
};

const updateIcons = (active: boolean) => {
  const postfix = active ? "" : "_off";
  const newIcon = {
    path: {
      16: `icons/icon16${postfix}.png`,
      48: `icons/icon48${postfix}.png`,
      128: `icons/icon128${postfix}.png`,
    },
  };
  chrome.action.setIcon(newIcon);
};

main();
