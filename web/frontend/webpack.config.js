var path = require('path');
var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function isExternal(module) {
  var context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}

module.exports = {
    target: 'web',
    entry: {
        main: './src/js/index.js',
    },
    output: {
        path: __dirname + '/assets/js',
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ["transform-object-rest-spread"]
                },
                exclude: [/node_modules/, 'socket.io-client']
            }
        ]
    },
    plugins: [
        new CircularDependencyPlugin({
          exclude: /a\.js|node_modules/,
          failOnError: true,
          cwd: process.cwd(),
        }),
        new UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
           name: 'vendors',
           minChunks: function(module) {
             return isExternal(module);
           }
       }),
    ]
}
