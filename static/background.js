let _active = true;

chrome.browserAction.onClicked.addListener(() => {
  _active = !_active;

  const postfix = _active ? "" : "_off";

  const newIcon = {
    path: {
      "16": `icon16${postfix}.png`,
      "48": `icon48${postfix}.png`,
      "128": `icon128${postfix}.png`
    }
  };
  chrome.browserAction.setIcon(newIcon);
});
