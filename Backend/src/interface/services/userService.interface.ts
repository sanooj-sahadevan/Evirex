import { IUser } from "../../models/userModel";

export interface IUserService {
    userLogin(email: string, password: string, httpRequest: any): Promise<{ user: IUser; accessToken: string; refreshToken: string } | { error: string }>;
    getUsers(): Promise<IUser[]>;
    updateUserAmount(userId: number, newAmount: number): Promise<IUser | null | { error: string }>;

}
