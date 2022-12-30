const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "dr-one";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src/assets/img",
            to: "img",
          },
          {
            from: "src/assets/icons",
            to: "icons",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          isProduction: webpackConfigEnv && webpackConfigEnv.isProduction,
          isTesting: webpackConfigEnv && webpackConfigEnv.isTesting,
          s3Bucket: process.env.REACT_APP_S3_BUCKET || "dr-uat-portal",
          orgName,
        },
      }),
    ],
  });
};
