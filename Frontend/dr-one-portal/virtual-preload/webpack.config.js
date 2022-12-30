const { merge } = require('webpack-merge')
const singleSpaDefaults = require('webpack-config-single-spa-react-ts')

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'dr-one',
    projectName: 'virtual-preload',
    webpackConfigEnv,
    argv
  })

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    externals: [
      'react-router-dom',
      'axios',
      '@material-ui/core',
      '@material-ui/icons',
      'styled-components'
    ]
  })
}
