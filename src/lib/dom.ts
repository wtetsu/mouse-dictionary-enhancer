/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import ponyfill from "./ponyfill/chrome";

const create = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

const applyStyles = (element: any, styles: Record<string, any>) => {
  if (!styles || typeof styles !== "object") {
    return;
  }
  try {
    for (const key of Object.keys(styles)) {
      element.style[key] = styles[key];
    }
  } catch (e) {
    console.error(e);
  }
};

const replace = (element: HTMLElement, newDom: HTMLElement) => {
  element.innerHTML = "";
  element.appendChild(newDom);
};

const MAX_TRAVERSE_LEVEL = 4;
const MAX_TRAVERSE_WORDS = 10;

const traverse = (elem: any) => {
  const resultWords = [];

  let current = elem;
  let skip = current;

  for (let i = 0; i < MAX_TRAVERSE_LEVEL; i++) {
    if (!current || current.tagName === "BODY") {
      break;
    }

    const words = getDescendantsWords(current, skip);
    resultWords.push(...words);

    if (resultWords.length >= MAX_TRAVERSE_WORDS) {
      break;
    }

    skip = current;
    current = current.parentNode;
  }

  return joinWords(resultWords.slice(0, MAX_TRAVERSE_WORDS));
};

const joinWords = (words: string[]) => {
  const newWords = [];
  let i = 0;
  for (;;) {
    if (i >= words.length) {
      break;
    }
    const w = words[i];

    if (w === "-") {
      if (newWords.length === 0) {
        const nextWord = words[i + 1];
        newWords.push("-" + nextWord);
      } else {
        const prevWord = newWords[newWords.length - 1] as string;
        const nextWord = words[i + 1];
        newWords[newWords.length - 1] = prevWord + "-" + nextWord;
      }
      i += 2;
    } else {
      newWords.push(w);
      i += 1;
    }
  }
  return newWords.join(" ");
};

const getDescendantsWords = (elem: Node, skip: Node | undefined = undefined): string[] => {
  const words = [];

  if (!elem.childNodes || elem.childNodes.length === 0) {
    if (elem === skip) {
      return [];
    }
    const t = elem?.textContent?.trim();
    return t ? [t] : [];
  }

  const children = getChildren(elem, skip);
  for (let i = 0; i < children.length; i++) {
    const descendantsWords = getDescendantsWords(children[i] as Node);
    words.push(...descendantsWords);
  }
  return words;
};

const getChildren = (elem: Node, skip: Node | undefined = undefined) => {
  if (!skip) {
    return elem.childNodes;
  }

  const result = [];
  for (let i = elem.childNodes.length - 1; i >= 0; i--) {
    const child = elem.childNodes[i];
    if (child === skip) {
      break;
    }
    result.push(child);
  }
  return result.reverse();
};

const clone = (orgElement: HTMLElement, baseElement: HTMLElement) => {
  const clonedElement = baseElement ?? document.createElement(orgElement.tagName);

  // Copy all styles
  clonedElement.style.cssText = ponyfill.getComputedCssText(orgElement);

  return clonedElement;
};

// "100px" -> 100.0
const pxToFloat = (str: string) => {
  if (!str) {
    return 0;
  }
  if (str.endsWith("px")) {
    return Number.parseFloat(str.slice(0, -2));
  }
  return Number.parseFloat(str);
};

/**
 * VirtualStyle can apply styles to the inner element.
 * This has "shadow" styles internally which can prevent from unnecessary style updates.
 *
 * Repeated element style updates could cause some unnecessary loads,
 * even if the assigned value is not different.
 *
 * element.style.cursor = "move";
 */
class VirtualStyle {
  element: HTMLElement;
  stagedStyles: Map<any, any>;
  appliedStyles: Map<any, any>;

  constructor(element: HTMLElement) {
    this.element = element;
    this.stagedStyles = new Map();
    this.appliedStyles = new Map();
  }

  set(prop: string, value: any) {
    if (this.stagedStyles.get(prop) === value) {
      return;
    }
    this.stagedStyles.set(prop, value);
    this.updateStyles();
  }

  apply(styles: Record<string, any>) {
    for (const [prop, value] of Object.entries(styles)) {
      this.stagedStyles.set(prop, value);
    }
    this.updateStyles();
  }

  updateStyles() {
    const diff = this.getUpdatedData(this.stagedStyles, this.appliedStyles);
    if (!diff) {
      return;
    }

    applyStyles(this.element, diff);
    this.stagedStyles = new Map();
    for (const [prop, value] of Object.entries(diff)) {
      this.appliedStyles.set(prop, value);
    }
  }

  getUpdatedData(stagedStyles: Map<any, any>, appliedStyles: Map<any, any>) {
    const diff: Record<string, any> = {};
    let count = 0;
    for (const [prop, stagedValue] of stagedStyles) {
      if (stagedValue !== appliedStyles.get(prop)) {
        diff[prop] = stagedValue;
        count += 1;
      }
    }
    if (count === 0) {
      return null;
    }
    return diff;
  }
}

export default { create, applyStyles, replace, traverse, clone, pxToFloat, VirtualStyle };
