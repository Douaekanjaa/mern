import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import locationRoutes from "./routes/location.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import proRoutes from "./routes/pro.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', `http://localhost:${PORT}`], // Allow multiple origins (replace PORT with Postman's port if fixed)
}));


app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/category", categoryRoutes);
app.use('/api/pros', proRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));



app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});
