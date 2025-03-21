import { generateAccessToken, generateRefreshToken } from "../utils/generateJWT";
import { UserSignupOutput } from "../interface/services/userService.types";
import { AppError } from "../utils/errors";

export class UserService {
    userLogin = async (email: string, password: string): Promise<UserSignupOutput> => {
        try {
            if (email !== process.env.USER_EMAIL || password !== process.env.USER_PASSWORD) {
                throw new AppError("Invalid Credentials", 401);
            }

            const accessToken = generateAccessToken(email, "user");
            const refreshToken = generateRefreshToken(email, "user");

            return { email, accessToken, refreshToken };
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    };
}
