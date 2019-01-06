[![Build Status](https://travis-ci.org/wtetsu/mouse-dictionary-iframe.svg?branch=master)](https://travis-ci.org/wtetsu/mouse-dictionary-iframe)
[![Code Climate](https://codeclimate.com/github/wtetsu/mouse-dictionary-iframe/badges/gpa.svg)](https://codeclimate.com/github/wtetsu/mouse-dictionary-iframe)

# Mouse Dictionary iframe support

This extension is an add-on for [Mouse Dictionary](https://github.com/wtetsu/mouse-dictionary), which makes it possible to use Mouse Dictionary inside cross-origin iframes.

## Kaggle

[Kaggle](https://www.kaggle.com/) is a typical site that uses cross-origin iframes for its important contents. Mouse Dictionary doesn't work on such iframes.

If you want to use Mouse Dictionary on Kaggle without any trouble, just install this "Mouse Dictionary Kaggle support". This add-on makes Mouse Dictionary available in cross-origin iframes on Kaggle.

- [Mouse Dictionary Kaggle support](https://chrome.google.com/webstore/detail/mouse-dictionary-iframe-s/bepofoammpdjhfdibmlghoaljkemineg)

Mouse Dictionary Kaggle support is built from this project.

## How it works

In order to resolve the problem above, cross-extension messaging is used.

Here is the outline.

![](img/outline.png)

## Third-party data

This project includes some third-party data:

### Images

Monitor icon

- https://www.iconfinder.com/icons/111019/monitor_icon
- License: [Creative Commons (Attribution-Share Alike 3.0 Unported)](https://creativecommons.org/licenses/by-sa/3.0/)

## License

MIT
