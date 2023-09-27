const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  devtool: 'source-map',
  plugins: [
    new SentryWebpackPlugin({
      org: 'chainbrary',
      project: 'chainbrary-ui',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      include: './dist/chainbrary',
      release: '0.0.3'
    })
  ]
};
