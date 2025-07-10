const path = require('path');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  output: {
    filename: 'alarm-clock-card.js',
    path: path.resolve(__dirname, '../www'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
  },
  // Bundle all dependencies instead of externalizing them
  externals: {},
};
