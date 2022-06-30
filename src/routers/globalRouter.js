import express from "express";
import { join, login } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
const globalRouter = express.Router(); // 라우터 만들기

globalRouter.get("/", home); // 라우터를 handler에 연결
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
