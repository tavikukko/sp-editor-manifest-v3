// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

var webpack = require('webpack'),
  config = require('../webpack.config');

config.plugins.push(new CopyPlugin({
  patterns: [
    {
      from: path.resolve(`./src/pages/Panel`, "Sandbox.html"),
      to: `./`
    },
  ],
}))
delete config.chromeExtensionBoilerplate;

config.mode = 'production';

webpack(config, function (err) {
  if (err) throw err;
});
