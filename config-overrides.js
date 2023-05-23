const webpack = require("webpack");

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

  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.stats = {
    warningsFilter: [/Failed to parse source map/],
  };
  config.output.path =  __dirname + '/docs'
  config.output.publicPath =  process.env.NODE_ENV === 'development' ? '/' : 'https://wushengwang.github.io/lego-pixel/'
  
  return config;
};
