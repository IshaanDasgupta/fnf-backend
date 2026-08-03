import express from "express";
import cors from "cors";

import authRoutes from "@/routes/auth";

import { jwtMiddleware } from "@/middleware/jwt";
import { requestLoggerMiddleware } from "@/middleware/logger";
import { errorMiddleware } from "@/middleware/error";

const app = express();

app.use(cors());

app.use(express.json());

app.use(jwtMiddleware);

app.use(requestLoggerMiddleware);

app.use("/auth", authRoutes);

app.use(errorMiddleware);

export default app;
