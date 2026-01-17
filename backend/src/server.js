import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

dotenv.config();

const app = express();

// Core middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: false }));
app.use(express.json({ limit: "1mb" }));

// Custom request logger
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend running (ESM)" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// 404 + Error middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));