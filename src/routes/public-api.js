import express from "express";
import userController from "../controllers/user-controllers.js";

const publicRouter = new express.Router();

publicRouter.post("/api/users/login", userController.login);

export { publicRouter };
