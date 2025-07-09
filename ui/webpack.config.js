const path = require('path');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  output: {
    filename: 'alarm-clock-card.js',
    path: path.resolve(__dirname, 'dist'),
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
  externals: {
    'custom-card-helpers': 'customCardHelpers',
    'lit': 'lit',
  },
};
