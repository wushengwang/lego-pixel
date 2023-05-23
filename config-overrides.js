const webpack = require("webpack");
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    os: require.resolve(`os-browserify/browser`),
    https: require.resolve(`https-browserify`),
    http: require.resolve(`stream-http`),
    stream: require.resolve(`stream-browserify`),
    util: require.resolve(`util/`),
    url: require.resolve(`url/`),
    assert: require.resolve(`assert/`),
    crypto: require.resolve(`crypto-browserify`),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  )

  
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.INFURA_ID': JSON.stringify('d57e1afa6ef84f89a91fedbe7d694a1f'),
      'process.env.DEFAULT_BLOCKCHAIN_NETWORK': JSON.stringify('mainnet'),
    })
  );
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });
  config.module.rules[1].oneOf[2] = {
    test: /\.svg$/,
    loader: require.resolve('svg-sprite-loader'),
    include: path.resolve(__dirname, './src/styles/icons')
  }
  config.stats = {
    warningsFilter: [/Failed to parse source map/],
  };
  return config;
};
