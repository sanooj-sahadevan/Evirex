/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginAPI } from "../services/api";


// Validation Schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/\d/, "Must include a number")
        .matches(/[@$!%*?&]/, "Must include a special character (@, $, !, %, *, ?, &)")
        .required("Password is required"),
});

const Login = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [error, setError] = useState<string>("");

    const handleLogin = async (data: any) => {
        setError("");

        const reqBody = { email: data.email, password: data.password };
        const reqHeader = { "Content-Type": "application/json" };
        try {
            const result = await LoginAPI(reqBody, reqHeader);
            console.log("LoginAPI result:", result);

            if (result.error) {
                if (result.message === "User not found") {
                    toast.error("No account found with this email.");
                } else if (result.message === "Invalid password") {
                    toast.error("Incorrect password. Please try again.");
                } else {
                    toast.error(result.message);
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 to-purple-500">
            <ToastContainer />
            <div className="bg-purple-800 bg-opacity-50 rounded-xl shadow-2xl p-8 w-96">
                <h2 className="text-3xl font-semibold text-white text-center mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit(handleLogin)}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            placeholder="Email"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            placeholder="Password"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
