import { Request } from "express";
import { ControllerResponse } from "../controller/userController.types";

export interface IUserController {
    userLogin(httpRequest: Request): Promise<ControllerResponse>;
    fetchUsers(): Promise<ControllerResponse>;
    updateUserAmount(httpRequest: Request): Promise<ControllerResponse>;
    userLogout(httpRequest: Request): Promise<ControllerResponse>; 
}
