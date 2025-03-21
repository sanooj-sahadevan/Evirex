"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const congig_1 = require("./config/congig");
//import authRoutes from "./routes/user";
const app = (0, express_1.default)();
const PORT = 8000;
(0, congig_1.connectToMongoDB)();
dotenv_1.default.config();
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//app.use("/api", authRoutes);
app.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
