module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^obsidian$": "<rootDir>/tests/__mocks__/obsidian.ts",
    "^@codemirror/state$": "<rootDir>/tests/__mocks__/@codemirror/state.ts",
    "^@codemirror/view$": "<rootDir>/tests/__mocks__/@codemirror/view.ts",
    "^@codemirror/language$": "<rootDir>/tests/__mocks__/@codemirror/language.ts",
  },
};
