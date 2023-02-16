const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'main.js',
	},
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
              test: /\.(jpg|png)$/,
              use: {
                loader: 'url-loader',
              },
            },
          {
          test: /\.(css)$/,
          use: [
              MiniCssExtractPlugin.loader,
              'css-loader'
          ],
          },
        ]
      },
  plugins: [
      new ESLintPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }
      )
  ],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist')
    },
    open:true
}
};