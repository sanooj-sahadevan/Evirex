import dotenv from "dotenv";

dotenv.config();


export const JWT_SECRET = () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT secret not found in env");
    return String(process.env.JWT_SECRET);
};