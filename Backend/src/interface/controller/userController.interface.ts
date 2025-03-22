import { Request } from "express";
import { ControllerResponse } from "../controller/userController.types";

export interface IUserController {
    userLogin(httpRequest: Request<any, any, any>): Promise<ControllerResponse>;
    fetchUsers(): Promise<ControllerResponse>;
    updateUserAmount(httpRequest: Request): Promise<ControllerResponse>;  
   //  userLogout = (req: Request, res: Response, next: NextFunction): void
    }
