const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/adapters')],

    output: {
        filename: "adapters-editor-bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    target: 'electron-renderer',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: /src/,
                use: ["babel-loader", "ts-loader"]
            },
            {
                test: /\.(js|jsx)$/,
                include: /src/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                include: /src/,
                use: {
                    loader: "html-loader"
                }
            },
            {
                test: /\.css$/,
                include: /src/,
                use: ["style-loader", "css-loader"]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'src/adapters.html'),
            filename: './adapters.html'
        })
    ],

    externals: {
        // don't bundle the 'react' npm package with our bundle.js, but get it from a global 'React' variable
        // for this, use the script tag so in index.html to get the React variable
        // jquery: 'jQuery'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }
};