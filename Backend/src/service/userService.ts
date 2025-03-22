import { IUserService } from "../interface/services/userService.interface";
import { IUserRepository } from "../interface/repository/userRepository.interface";
import { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import { Response } from 'express'; // Import Response type

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async userLogin(email: string, password: string, res?: Response): Promise<{ user: IUser; accessToken: string; refreshToken: string } | { error: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return { error: "User not found" };
        }

        if (user.password !== password) {
            return { error: "Incorrect password" };
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "sanooj", { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || "sanooj_refresh", { expiresIn: "7d" });

        // Set cookie if Response object is provided.  This is optional and allows more flexibility.
        if (res) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                domain: "https://evirex-9.onrender.com",
                // path: "/",

            });
        }

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     domain: ".eventopia.shop",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        //   });


        return { user, accessToken, refreshToken };
    }

    async getUsers(): Promise<IUser[]> {
        return this.userRepository.getAllUsers();
    }


    async updateUserAmount(userId: number, newAmount: number): Promise<IUser | null | { error: string }> {
        console.log(userId, 'service', newAmount);

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