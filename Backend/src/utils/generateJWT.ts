import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

export function generateAccessToken(id: string): string {
  try {
    const payload = { id };  
    const options = { expiresIn: 60 * 60 };
    return jwt.sign(payload, JWT_SECRET(), options);
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export function generateRefreshToken(id: string): string {
  try {
    const payload = { id }; 
    const options = { expiresIn: 60 * 60 * 24 * 7 };
    return jwt.sign(payload, JWT_SECRET(), options);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
