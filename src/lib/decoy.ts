/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import dom from "./dom";

const create = (tag: string) => {
  return new Decoy(tag);
};

const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION"]);

const DEFAULT_STYLES = {
  position: "absolute",
  zIndex: 2147483647,
  opacity: 0,
};

const STYLES = {
  INPUT: { overflow: "hidden", whiteSpace: "nowrap" },
  TEXTAREA: { overflow: "hidden" },
  SELECT: { overflow: "hidden", whiteSpace: "nowrap" },
  OPTION: { overflow: "hidden", whiteSpace: "nowrap" },
};

class Decoy {
  elementCache: any;
  decoy: HTMLElement | null;

  constructor(tag: string) {
    this.elementCache = createElement(tag);
    this.decoy = null;
  }

  activate(underlay: HTMLElement) {
    if (!this.elementCache) {
      return;
    }
    if (!INPUT_TAGS.has(underlay.tagName)) {
      return;
    }
    const decoy = prepare(dom.clone(underlay, this.elementCache), underlay);

    document.body.appendChild(decoy);
    this.decoy = decoy;

    // These values are required to be set after appendChild.
    decoy.scrollTop = underlay.scrollTop;
    decoy.scrollLeft = underlay.scrollLeft;
    const correctionWidth = underlay.clientWidth - decoy.clientWidth;
    const correctionHeight = underlay.clientHeight - decoy.clientHeight;
    const width = `${underlay.clientWidth + correctionWidth}px`;
    const height = `${underlay.clientHeight + correctionHeight}px`;
    dom.applyStyles(decoy, { width, height });
  }

  deactivate() {
    if (!this.elementCache) {
      return;
    }
    const decoy = this.decoy;
    this.decoy = null;
    if (decoy) {
      document.body.removeChild(decoy);
    }
  }
}

const createElement = (tag: string) => {
  if (!tag) {
    return null;
  }
  return document.createElement(tag);
};

const prepare = (decoy: HTMLElement, underlay: HTMLElement) => {
  decoy.innerText = getElementText(underlay);

  const style = createDecoyStyle(decoy, underlay);

  // Specify only absolute size
  style.width = `${underlay.clientWidth}px`;
  style.height = `${underlay.clientHeight}px`;
  dom.applyStyles(decoy, style);
  for (const p of ["min-width", "min-height", "max-width", "max-height"]) {
    decoy.style.removeProperty(p);
  }
  return decoy;
};

const getElementText = (element: any) => {
  if (element.tagName === "SELECT") {
    return getSelectText(element as HTMLSelectElement);
  }
  return element.text ?? element.value;
};

function getSelectText(element: HTMLSelectElement) {
  var index = element.selectedIndex;
  return element.options[index]?.text;
}

const createDecoyStyle = (decoy: HTMLElement, underlay: HTMLElement): Record<string, any> => {
  const offset = getOffset(underlay);
  const top = offset.top - dom.pxToFloat(decoy.style.marginTop);
  const left = offset.left - dom.pxToFloat(decoy.style.marginLeft);

  const dynamicStyles = {
    top: `${top}px`,
    left: `${left}px`,
  };

  return { ...dynamicStyles, ...DEFAULT_STYLES, ...STYLES[underlay.tagName as keyof typeof STYLES] };
};

const getOffset = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const doc = document.documentElement;

  return {
    top: rect.top + window.pageYOffset - doc.clientTop,
    left: rect.left + window.pageXOffset - doc.clientLeft,
  };
};

export { Decoy };

export default { create };
