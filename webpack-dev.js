//// Work in progress, plan is to separate front end hot reloading of JS files from back end of app (for non-Node.js back ends)

// we start a webpack-dev-server with our config
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var dotenv = require('dotenv');
var config = require('./webpack.config.dev');

// Grabs key-value pairs from ".env" folder and sets keys as properties on "process.env" object accessable anywhere in the app
dotenv.config();

const appPort = process.env.PORT || process.env.DEV_PORT || 3000;
const webpackPort = +appPort + 1;

new WebpackDevServer(webpack(config), {
   contentBase: './public',
   debug: true,
   hot: true,
   historyApiFallback: true,
   proxy: {
     "*": "http://localhost:" + appPort
   }
}).listen(webpackPort, '0.0.0.0', function (err, result) {
   if (err) console.log(err);

   console.log('Webpack Dev Server listening at localhost:' + webpackPort);
});
