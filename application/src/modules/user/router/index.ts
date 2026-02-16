import express from "express";
import { userService } from "../service/user.service.js";
import { UserController } from "../controller/user.controller.js";

const userController = new UserController(userService);

const router = express.Router();
router.post("/create", userController.create);
router.get("/:telegramId", userController.get);
router.put("/:telegramId", userController.updateUsername);

export { router as userRouter };
