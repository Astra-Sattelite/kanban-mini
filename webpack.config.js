const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[8].js' : '[name].js',
      publicPath: isProd ? './' : '/',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: [/node_modules/, /\.test\.tsx?$/],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],

    devtool: isProd ? false : 'source-map',

    devServer: {
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
    },

    performance: {
      hints: false,
    },
  };
};