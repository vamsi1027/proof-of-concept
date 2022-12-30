const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "dr-one",
    projectName: "utils",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new DefinePlugin({
        'process.env.ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.REACT_APP_MIXPANEL_TOKEN': JSON.stringify(process.env.REACT_APP_MIXPANEL_TOKEN),
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
        'process.env.REACT_APP_GOOGLE_MAP_API_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAP_API_KEY)
      })
    ]
  });
};
