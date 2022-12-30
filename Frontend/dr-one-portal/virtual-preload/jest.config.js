module.exports = {
  rootDir: "src",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
    "@dr-one/utils": "<rootDir>/../../utils/index.d.ts",
    "@dr-one/shared-component": "<rootDir>/../../shared-component/index.d.ts"
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
