import { Request, Response } from "express";
import { UserService } from "../service/userService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

//   async getAllUsers(req: Request, res: Response): Promise<void> {
//     try {
//       const users = await this.userService.getAllUsers();
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
}
