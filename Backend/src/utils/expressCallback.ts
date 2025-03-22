
// import { NextFunction, Request, Response } from "express";

// export function expressCallback(controller: any) {
//   return async function (req: Request, res: Response, next: NextFunction) {
//     const httpRequest = {
//       body: req.body,
//       query: req.query,
//       params: req.params,
//       ip: req.ip,
//       method: req.method,
//       path: req.path,
//       headers: {
//         "Content-Type": req.get("Content-Type"),
//         Referer: req.get("referer"),
//         "User-Agent": req.get("User-Agent"),
//       },
//     };

//     try {
//       const httpResponse = await controller(httpRequest);

//       if (httpResponse.headers) {
//         res.set(httpResponse.headers);
//       }

//       if (httpResponse.accessToken) {
//         res.cookie("accessToken", httpResponse.accessToken, {
//           httpOnly: false,
//         });
//       }

//       if (httpResponse.refreshToken) {
//         res.cookie("refreshToken", httpResponse.refreshToken, {
//           httpOnly: true,
//         });
//       }

//       res.type("json");
//       res.status(httpResponse.statusCode).send(httpResponse.body);
//     } catch (e: any) {
//       next();
//     }
//   };
// }


import { Request, Response, NextFunction } from 'express';
import { IUserController } from '../interface/controller/userController.interface';
import { ControllerResponse } from '../interface/controller/userController.types';

// Define a type for a controller function that accepts the Request and returns a Promise of ControllerResponse
type ControllerFunction = (req: Request, res: Response) => Promise<ControllerResponse>;

// Higher-order function to adapt controller functions to Express middleware
const expressCallback = (controller: IUserController[keyof IUserController]): any => { // Removed ControllerFunction type, this causes ts error
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const controllerResponse = await (controller as any)(req); // Cast 'controller' to 'any'
                
            if (controllerResponse.headers) {
                res.set(controllerResponse.headers);
            }

            res.status(controllerResponse.statusCode).json(controllerResponse.body);

        } catch (error: any) {
            console.error("expressCallback error:", error);
            next(error); // Pass the error to the next middleware (e.g., error handler)
        }
    };
};

export default expressCallback;
