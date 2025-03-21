import { Request } from "express";
import { IUserController } from "../interface/controller/userController.interface";
import { ControllerResponse } from "../interface/controller/userController.types";
import { IUserService } from "../interface/services/userService.interface";

export class UserController implements IUserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    userLogin = async (httpRequest: Request): Promise<ControllerResponse> => {
        try {
            const { email, password } = httpRequest.body;
            const user = await this.userService.userLogin(email, password);

            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
                body: user,
            };
        } catch (e: any) {
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: e.statusCode || 500,
                body: { error: e.message },
            };
        }
    };
}