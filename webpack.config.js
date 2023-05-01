// webpack.config.js
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from "path";

export default {
  mode: 'development',
  entry: './src/app.ts',
  devtool: 'inline-source-map',
  devServer: {
    port: 8000,
    static: "./",
    open: true,
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
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
