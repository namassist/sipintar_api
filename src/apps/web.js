import express from "express";
import cors from "cors";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { userRouter } from "../routes/api.js";

export const web = express();
web.use(express.json());
web.use(cors());

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
