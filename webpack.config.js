const path = require("path");
//const config = require("./package.json");
const file1 = 'fingerprint.js';
//const file1 = 'fingerprint-2.js';

module.exports = {
    mode: 'development',
    entry: [
        path.resolve(__dirname, './scripts/', file1)
    ],
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: `./public/bundle-${file1}`
    }
};