import http from "http";
import express from "express";
import userRouter from "./routes/Users/userRouter.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import {
  globalErrorHandler,
  notFound,
} from "./middlewares/globalErrorHandler.js";
import categoryRoute from "./routes/category/categoryRouter.js";
dotenv.config();
connectDB();
//!Server
const app = express();

const server = http.createServer(app);

//? Start the server
const PORT = process.env.PORT || 9080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRoute);

//? Not Found Middleware
app.use(notFound);

//! Error Handler Middleware
app.use(globalErrorHandler);

server.listen(
  PORT,
  console.log(`Server is running on the port number ${PORT}`)
);
