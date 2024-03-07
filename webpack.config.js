// webpack.config.js
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from "path";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default function (env) { 
  const mode = 
    (env.mode === 'demo') ? 'demo' : 'release';

  return {
    mode: (mode === "demo") ? "development" : "production",
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    devServer: {
      port: 8000,
      static: "./",
      open: false,
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["css-loader"],
        },
        {
          test: /\.json$/,
          type: 'json',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', ".json"],
      alias: {
        "kanaloa-address-book.json": 
          path.resolve(
            new URL('.', import.meta.url).pathname, 
            `src/data/kanaloa-address-book.${mode}.json`
          ),
      },
    },
    optimization: {
      splitChunks: false, // Disables the SplitChunksPlugin
      runtimeChunk: false, // Prevents an extra chunk for the webpack runtime
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve('dist'),
      publicPath: "/"
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
    ],
  };
}