const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  devtool: 'source-map',
  plugins: [
    new SentryWebpackPlugin({
      org: 'chainbrary',
      project: 'chainbrary-ui',
      authToken: 'b435462464a34381b95a9b7cb07c96233c0fd24162ee42f5ab05090e30b3a570',
      include: './dist/chain-brary'
    })
  ]
};
