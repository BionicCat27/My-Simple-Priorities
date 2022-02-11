const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: 'development',
  entry: '/src/app.js',
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\js$/,
      exclude: /node_modules/
    },
    {
      use: [
        'style-loader',
        'css-loader'
      ],
      test: /\.css$/,
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css"],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'src'),
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: path.join(__dirname, 'src'),
    hot: true,
    historyApiFallback: true
  }
};
