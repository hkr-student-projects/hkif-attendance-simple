const path = require("path");
//const config = require("./package.json");
const name = 'fingerprint.js';

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './scripts/', name),
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: `./public/bundle-${name}`
    }
};