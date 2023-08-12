import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import challengeRouter from "./routes/challengeRoutes.js";
import groupRouter from "./routes/groupRoutes.js";

const app = express();

// Using the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/motivation-app", { useNewUrlParser: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log(err);
  });

// Mount the routes in routes folder
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/challenge", challengeRouter);
app.use("/api/group", groupRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);
  Error.captureStackTrace(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Some error occured";

  // Default error response
  res.status(err.statusCode).json({
    error: err.message,
  });
});

const PORT = 8888;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
