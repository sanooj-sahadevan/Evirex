import { Request, Response } from "express"; // Import Response here
import { IUserController } from "../interface/controller/userController.interface";
import { ControllerResponse } from "../interface/controller/userController.types";
import { IUserService } from "../interface/services/userService.interface";
import { log } from "node:console";

export class UserController implements IUserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    userLogin = async (httpRequest: Request): Promise<ControllerResponse> => {
        try {
            const { email, password } = httpRequest.body;
            const userLoginResult = await this.userService.userLogin(email, password, httpRequest.res);

            if ('error' in userLoginResult) {
                return {
                    headers: { "Content-Type": "application/json" },
                    statusCode: 401,  // or whatever status code is appropriate
                    body: { error: userLoginResult.error },
                };
            }

            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
                body: userLoginResult,
            };
        } catch (e: any) {
            console.error("Error in userLogin controller:", e);  // Log the error
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
            console.error("Error in fetchUsers controller:", e);  // Log the error
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: e.statusCode || 500,
                body: { error: e.message },
            };
        }
    };

    updateUserAmount = async (httpRequest: Request): Promise<ControllerResponse> => {
        try {
            console.log('Updating user amount in controller...');

            const { userId } = httpRequest.params;
            const { amount } = httpRequest.body;
            console.log(userId, 'controller');

            if (!userId || !amount) {
                return {
                    headers: { "Content-Type": "application/json" },
                    statusCode: 400,
                    body: { error: "Both userId and amount are required." },
                };
            }

            const updatedUser = await this.userService.updateUserAmount(Number(userId), Number(amount)); 

            if (!updatedUser) {
                return {
                    headers: { "Content-Type": "application/json" },
                    statusCode: 404,
                    body: { error: "User not found." },
                };
            }

            if ('error' in updatedUser) {
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

    userLogout = async (httpRequest: Request): Promise<ControllerResponse> => {
        try {
            if (!httpRequest.res) {
                console.error("Response object is undefined in userLogout");
                return {
                    headers: { "Content-Type": "application/json" },
                    statusCode: 500,
                    body: { error: "Response object is undefined" },
                };
            }

            httpRequest.res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
                body: { message: 'Logout successful' },
            };

        } catch (error: any) {
            console.error('Logout error:', error);
            return {
                headers: { "Content-Type": "application/json" },
                statusCode: 500,
                body: { error: error.message || 'Internal server error' },
            };
        }
    };
}