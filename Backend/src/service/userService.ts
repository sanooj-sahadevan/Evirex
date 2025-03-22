import { IUserService } from "../interface/services/userService.interface";
import { IUserRepository } from "../interface/repository/userRepository.interface";
import { IUser } from "../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../utils/generateJWT";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async userLogin(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string } | { error: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return { error: "User not found" };
        }

        if (user.password !== password) {
            return { error: "Incorrect password" };
        }

        // Generate JWT tokens (without role)
        const accessToken = generateAccessToken(user.id.toString());
        const refreshToken = generateRefreshToken(user.id.toString());

        return { user, accessToken, refreshToken };
    }

    async getUsers(): Promise<IUser[]> {
        return this.userRepository.getAllUsers();
    }
    async updateUserAmount(userId: number, newAmount: number): Promise<IUser | null | { error: string }> {
        if (typeof newAmount !== 'number' || newAmount < 0) {
            return { error: "Invalid amount. Amount must be a non-negative number." };
        }
        const updatedUser = await this.userRepository.updateUserAmount(userId, newAmount);
        if (!updatedUser) {
            return { error: "User not found" };
        }
        return updatedUser;
    }
  
}
