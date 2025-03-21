import { Router } from "express";

import { UserController } from "../controller/userController";
import { UserService } from "../service/userService";
import { UserRepository } from "../repository/userRepository";

const router = Router();


const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)



export default router;

