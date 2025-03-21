import { GetUserOutput } from "./userRepository.types";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<GetUserOutput>;
}