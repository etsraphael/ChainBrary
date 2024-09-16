const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const plugins = [];

if (process.env.SENTRY_AUTH_TOKEN) {
  plugins.push(
    new SentryWebpackPlugin({
      org: 'chainbrary',
      project: 'chainbrary-ui',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      include: './dist/chainbrary',
      release: '0.0.3'
    })
  );
}

module.exports = {
  devtool: 'source-map',
  plugins: plugins
};
