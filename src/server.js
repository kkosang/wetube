import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

console.log(process.cwd());

const app = express();
const PORT = 3188;
const logger = morgan("dev");

app.set("view engine", "pug"); // view engine을 pug로 세팅
app.set("views", process.cwd() + "/src/views"); // view 설정 바꾸기
app.use(logger);
app.get("/", globalRouter); // 사용자의 get요청시 globalRouter 라우팅
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
