import express from "express";
import cors from "cors";

import authRoutes from "@/routes/auth";
import userRoutes from "@/routes/user";
import listingRoutes from "@/routes/listing";
import localityRoutes from "@/routes/locality";
import redirectRoutes from "@/routes/redirect";

import { jwtMiddleware } from "@/middleware/jwt";
import { requestLoggerMiddleware } from "@/middleware/logger";
import { errorMiddleware } from "@/middleware/error";

import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/redirect", redirectRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/terms", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "terms.html"));
});

app.get("/privacy", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "privacy.html"));
});

app.use(jwtMiddleware);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/listing", listingRoutes);
app.use("/locality", localityRoutes);

app.use(errorMiddleware);

export default app;
