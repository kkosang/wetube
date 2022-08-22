const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js", // 변경하고자 하는 파일의 경로
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"), // 변형된 결과물의 저장 경로
    // dirname : directory name 파일까지의 전체 경로
    // path.resolve : 뒤의 몇개가 오던지 처음부터 끝까자 경로를 만들어줌
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
