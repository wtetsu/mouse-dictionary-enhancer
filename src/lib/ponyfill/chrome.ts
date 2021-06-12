/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

const getComputedCssText = (params: HTMLElement) => {
  const computedStyle = window.getComputedStyle(params);
  return computedStyle.cssText;
};

const getCaretNodeAndOffsetFromPoint = (ownerDocument: any, pointX: number, pointY: number) => {
  const range = ownerDocument.caretRangeFromPoint(pointX, pointY);
  if (!range) {
    return null;
  }
  return {
    node: range.startContainer,
    offset: range.startOffset,
  };
};

export default { getComputedCssText, getCaretNodeAndOffsetFromPoint };
