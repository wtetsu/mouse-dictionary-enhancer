/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import decoy from "./decoy";
import type { Decoy } from "./decoy";
import dom from "./dom";
import ponyfill from "./ponyfill/chrome";

type GetLetterType = (arg0: number) => number; // eslint-disable-line

const build = (doConfirmValidCharacter: GetLetterType, maxWords: number) => {
  const traverser = new Traverser(doConfirmValidCharacter, maxWords);

  const getTextUnderCursor = (element: HTMLElement, clientX: number, clientY: number) => {
    let textOnCursor: string[] | undefined;
    try {
      textOnCursor = traverser.fetchTextUnderCursor(element, clientX, clientY);
    } catch (err) {
      console.error(err);
    }
    return textOnCursor ?? [];
  };

  return getTextUnderCursor;
};

class Traverser {
  JA_MAX_LENGTH: number;
  maxWords: number;
  getTargetCharacterType: GetLetterType;
  decoy: Decoy;

  constructor(doGetTargetCharacterType: GetLetterType, maxWords: number) {
    this.JA_MAX_LENGTH = 40;
    this.getTargetCharacterType = doGetTargetCharacterType ?? ((code) => (isEnglishLikeCharacter(code) ? 3 : 0));
    this.maxWords = maxWords ?? 8;
    this.decoy = decoy.create("div");
  }

  fetchTextUnderCursor(element: HTMLElement, clientX: number, clientY: number) {
    const range = ponyfill.getCaretNodeAndOffsetFromPoint(element.ownerDocument, clientX, clientY);
    if (!range) {
      return [];
    }
    const { node, offset } = range;

    if (node.nodeType === Node.TEXT_NODE) {
      return this.fetchTextFromTextNode(node, offset);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return this.fetchTextFromElementNode(element, clientX, clientY);
    }

    return [];
  }

  fetchTextFromTextNode(textNode: any, offset: number) {
    const { text, subText, end, isEnglish } = this.getTextFromRange(textNode.data, offset);
    const textList = subText ? [text, subText] : [text];
    if (!end) {
      return textList;
    }
    const followingText = dom.traverse(textNode);
    return textList.map((t) => this.concatenate(t, followingText, isEnglish));
  }

  concatenate(text: string, followingText: string, isEnglish: boolean) {
    const concatenatedText = concatenateFollowingText(text, followingText, isEnglish);
    const endIndex = isEnglish
      ? searchEndIndex(concatenatedText, 0, this.maxWords, this.getTargetCharacterType)
      : this.JA_MAX_LENGTH;
    return concatenatedText.substring(0, endIndex);
  }

  fetchTextFromElementNode(element: HTMLElement, clientX: number, clientY: number) {
    try {
      this.decoy.activate(element);

      const range = ponyfill.getCaretNodeAndOffsetFromPoint(element.ownerDocument, clientX, clientY);
      if (!range) {
        return;
      }
      const { node, offset } = range;

      if (node.nodeType === Node.TEXT_NODE) {
        return this.fetchTextFromTextNode(node, offset);
      }
    } finally {
      this.decoy.deactivate();
    }
  }

  getTextFromRange(
    sourceText: string,
    offset: number,
  ): { text: string; subText: string; end: boolean; isEnglish: boolean } {
    if (!sourceText) {
      return { text: "", subText: "", end: false, isEnglish: false };
    }
    const code = sourceText.charCodeAt(offset);
    const isEnglish = isEnglishLikeCharacter(code);

    let startIndex: number;
    let endIndex: number;
    let text: string;
    let subText = "";
    if (isEnglish) {
      startIndex = searchStartIndex(sourceText, offset, this.getTargetCharacterType);
      endIndex = searchEndIndex(sourceText, offset, this.maxWords, this.getTargetCharacterType);
      text = sourceText.substring(startIndex, endIndex);
    } else {
      startIndex = offset;
      endIndex = offset + this.JA_MAX_LENGTH;

      const properStartIndex = retrieveProperStartIndex(sourceText, startIndex + 1);
      text = sourceText.substring(properStartIndex, endIndex);

      if (startIndex !== properStartIndex) {
        subText = sourceText.substring(startIndex, endIndex);
      }
    }
    const end = endIndex >= sourceText.length;
    return { text, subText, end, isEnglish };
  }
}

const retrieveProperStartIndex = (sourceText: string, cursorIndex: number) => {
  let currentLength = 0;
  const tokens = tokenize(sourceText, "ja-JP");
  if (!tokens) {
    return 0;
  }
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (cursorIndex <= currentLength + token.length) {
      return currentLength;
    }
    currentLength += token.length;
  }
  return 0;
};

const searchStartIndex = (text: string, index: number, doGetCharacterType: GetLetterType) => {
  let startIndex: number;
  let i = index;
  for (;;) {
    const code = text.charCodeAt(i);
    const toPursue = doGetCharacterType(code) & 1;
    if (!toPursue) {
      startIndex = i + 1;
      break;
    }
    if (i <= 0) {
      startIndex = 0;
      break;
    }
    i -= 1;
  }
  return startIndex;
};

const searchEndIndex = (text: string, index: number, maxWords: number, doGetCharacterType: GetLetterType) => {
  let endIndex: number;
  let i = index + 1;
  let spaceCount = 0;
  let theLastIsSpace = false;
  for (;;) {
    const code = text.charCodeAt(i);
    if (code === 0x20) {
      if (!theLastIsSpace) {
        spaceCount += 1;
      }
      theLastIsSpace = true;
      if (spaceCount >= maxWords) {
        endIndex = i;
        break;
      }
    } else {
      const toPursue = doGetCharacterType(code) & 2;
      if (!toPursue) {
        endIndex = i;
        break;
      }
      theLastIsSpace = false;
    }
    if (i >= text.length) {
      endIndex = i;
      break;
    }

    i += 1;
  }
  return endIndex;
};

const concatenateFollowingText = (text: string, followingText: string, isEnglish: boolean) => {
  if (!followingText) {
    return text;
  }
  if (!isEnglish) {
    return text + followingText;
  }
  if (followingText.startsWith("-")) {
    return text + followingText;
  }
  return text + " " + followingText;
};

const isEnglishLikeCharacter = (code: number) => 0x20 <= code && code <= 0x7e;

const tokenize = (text: string, lang: string) => {
  if (!Intl?.v8BreakIterator) {
    return null;
  }
  const it = Intl.v8BreakIterator([lang], { type: "word" });
  it.adoptText(text);

  let cur = 0;

  const words = [];
  while (cur < text.length) {
    const prev = cur;
    cur = it.next();
    words.push(text.substring(prev, cur));
  }
  return words;
};

export default { build };
