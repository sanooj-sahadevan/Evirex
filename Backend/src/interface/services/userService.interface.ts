import {  UserSignupOutput } from "./userService.types";

export interface IUserService {

  userLogin(email: string, password: string): Promise<UserSignupOutput>;
}