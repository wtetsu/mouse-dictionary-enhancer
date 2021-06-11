/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import letter from "../src/lib/rule/letter";

test("", () => {
  expect(letter(0)).toEqual(undefined);
  expect(letter(39)).toEqual(3);
  expect(letter(57)).toEqual(3);
  expect(letter(70)).toEqual(3);
  expect(letter(90)).toEqual(3);
  expect(letter(95)).toEqual(3);
  expect(letter(110)).toEqual(3);
  expect(letter(8204)).toEqual(2);
  expect(letter(8209)).toEqual(3);
});
