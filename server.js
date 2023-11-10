import http from "http";
import express from "express";
import userRouter from "./routes/Users/userRouter.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
dotenv.config();
connectDB();
//!Server
const app = express();

const server = http.createServer(app);

//? Start the server
const PORT = process.env.PORT || 9080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

server.listen(
  PORT,
  console.log(`Server is running on the port number ${PORT}`)
);
