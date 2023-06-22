const path = require("path");
const CopyPlugin = require("copy-webpack-plugin")
const { join } = require('path');

module.exports = {
    entry: {
        content: join(__dirname, 'src/content.tsx'),
        background: join(__dirname, 'src/background.ts'),
    },
    mode: "production",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
              },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: "manifest.json", 
                    to: "../manifest.json" 
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};
