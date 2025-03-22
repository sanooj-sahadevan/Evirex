import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config'

import { connectToMongoDB } from "./config/config"
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 8000;

connectToMongoDB();



app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        const allowedOrigins = [
           "http://localhost:3000",
            "https://evirex.vercel.app",
             '*'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(null, "*");
        }
    }
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);

app.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
