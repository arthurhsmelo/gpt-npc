export default {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    // Remove extension needed by NodeNext
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
