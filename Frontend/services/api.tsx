/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SERVER_URL } from "./serverURL";
import axios from "axios";

const Axios = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const LoginAPI = async (reqBody: any, reqHeader?: Record<string, string>) => {
  try {
    console.log("Attempting login...", reqBody, reqHeader);
    const response = await Axios.post(`${SERVER_URL}/api/login`, reqBody, {
      headers: {
        ...reqHeader,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("LoginAPI Error:", error.response?.data || error.message);
    return { error: true, message: error.response?.data?.message || "Login failed. Please try again." };
  }
};


export const FetchUSer = async () => {
  try {
    console.log("Attempting to fetch users");
    const response = await Axios.get(`${SERVER_URL}/api/fetchuser`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("API response data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("FetchUSer Error:", error);
    return { error: true, message: "Failed to fetch users. Please try again." };
  }
};

export const LogoutAPI = async () => {
  try {
    const response = await Axios.post(`${SERVER_URL}/api/logout`, {}, { withCredentials: true });
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("LogoutAPI Error:", error);
    return { error: true, message: "Logout failed. Please try again." };
  }
};




export const UpdateUserAmount = async (userId: number, newAmount: number): Promise<boolean> => {
  try {
    console.log(userId, 'userid');

    const response = await axios.put(`${SERVER_URL}/usersUpdate/${userId}`, { amount: newAmount });
    console.log(response);

    return response.status === 200;
  } catch (error) {
    console.error("Error updating user amount:", error);
    return false;
  }
};