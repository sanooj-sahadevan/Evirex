import mongoose from "mongoose";
import { IUserRepository } from "../interface/repository/userRepository.interface";
import { UserModel, IUser } from "../models/userModel";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }

    async getAllUsers(): Promise<IUser[]> {
        return UserModel.find();
    }


    async updateUserAmount(userId: number, newAmount: number): Promise<IUser | null> {
        try {
            // if (!mongoose.Types.ObjectId.isValid(userId.toString())) {
            //     console.log("Invalide user Id ");
            //     return null;
            // }
            console.log(userId,newAmount);
            
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId },
                { amount: newAmount },
                { new: true }
            ).lean();
            console.log("update data");
            return updatedUser as IUser;
        } catch (error) {
            console.error("Error updating user amount in repository:", error);
            return null;
        }
    }




}
