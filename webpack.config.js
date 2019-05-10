const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "wwwroot"),
        filename: "[name].[chunkhash].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["wwwroot/*"]),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyWebpackPlugin([
            {from: "./src/img", to: "./src/img"},
            {from: "./src/fonts", to: "./src/fonts"},
            {from: "./src/css", to: "./src/css"}
        ])
    ]
};