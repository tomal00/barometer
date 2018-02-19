var path = require('path');
var webpack = require('webpack');
var CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
    target: 'web',
    entry: {
        main: './experimental/main.js'
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
                    presets: ['react', 'es2015']
                },
                exclude: [/node_modules/, './assets/js/socket.io.js', 'socket.io-client']
            }
        ]
    },
    plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ]
}
