module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^ponyfill$": "<rootDir>/src/lib/ponyfill/chrome",
  },
  moduleFileExtensions: ["ts", "js"],
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json",
    },
  },
};
