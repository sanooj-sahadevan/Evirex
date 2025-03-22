import { Request, Response } from "express";
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

    fetchUsers = async (): Promise<ControllerResponse> => {
        try {
            const users = await this.userService.getUsers();
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
                body: users,
            };
        } catch (e: any) {
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: e.statusCode || 500,
                body: { error: e.message },
            };
        }
    };

    updateUserAmount = async (httpRequest: Request): Promise<ControllerResponse> => {
        try {
            const { userId } = httpRequest.params;
            const { amount } = httpRequest.body;

            const updatedUser = await this.userService.updateUserAmount(Number(userId), Number(amount)); // Convert userId and amount to numbers

            if (updatedUser && 'error' in updatedUser) {
                return {
                    headers: { "Content-Type": "application/json" },
                    statusCode: 400, // Or appropriate status code
                    body: { error: updatedUser.error },
                };
            }

            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
                body: updatedUser,
            };

        } catch (e: any) {
            console.error("Error updating user amount in controller:", e);
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: e.statusCode || 500,
                body: { error: e.message },
            };
        }
    };


    
    
}
