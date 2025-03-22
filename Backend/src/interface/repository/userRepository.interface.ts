import { IUser } from "../../models/userModel";

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
    updateUserAmount(userId: number, newAmount: number): Promise<IUser | null>; // Add this line

}
