const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  }, // 변경하고자 하는 파일의 경로
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js", // [name]시 파일의 이름을 따라 감
    path: path.resolve(__dirname, "assets"), // 변형된 결과물의 저장 경로
    // dirname : directory name 파일까지의 전체 경로
    // path.resolve : 뒤의 몇개가 오던지 처음부터 끝까자 경로를 만들어줌
    clean: true, // output폴더를 build하기전에 clean해줌
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader", // loader는 파일을 전환해줌
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/, // scss파일을 변환
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 마지막 loader부터 역순으로 // webpack은 뒤에서부터 실행
        // scss-> css로 변환
        // css를 프론트엔드에 적용
        // font와 같은 styles
      },
    ],
  },
};
