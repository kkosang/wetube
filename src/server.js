import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); // view engine을 pug로 세팅
app.set("views", process.cwd() + "/src/views"); // view 설정 바꾸기
app.use(logger);
app.use(express.urlencoded({ extended: true })); // middleware를 route를 사용하기 전에 사용
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localMiddleware);
app.use("/uploads", express.static("uploads")); // 브라우저에게 폴더 전체를 노출시킴
app.use("/static", express.static("assets")); // 브라우저에게 폴더 전체를 노출시킴
app.use("/", rootRouter); // 사용자의 get요청시 globalRouter 라우팅
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
