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
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId },
                { amount: newAmount },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error("Error updating user amount in repository:", error);
            return null;
        }
    }

   
}
