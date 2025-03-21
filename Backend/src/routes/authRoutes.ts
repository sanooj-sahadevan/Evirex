import { Router } from "express";
import { UserController } from "../controller/userController";
import { UserService } from "../service/userService";
import { UserRepository } from "../repository/userRepository";
import { loginValidator } from "../middleware/loginValidator";
import { expressCallback } from "../utils/expressCallback";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/login", loginValidator, expressCallback(userController.userLogin));

export default router;