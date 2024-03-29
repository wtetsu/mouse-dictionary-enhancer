/**
 * Mouse Dictionary Enhancer(https://github.com/wtetsu/mouse-dictionary-enhancer/)
 * Copyright 2019-present wtetsu
 * Licensed under MIT
 */

const main = async () => {
  let _active = true;

  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    switch (request.type) {
      case "isActive":
        sendResponse({ isActive: _active });
        break;
      case "toHtmlMode":
        if (_active) {
          sendResponse("htmlMode.js");
        }
        break;
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
