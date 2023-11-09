import http from "http";
import express from "express";

//!Server
const app = express();

const server = http.createServer(app);

//? Start the server

const PORT = process.env.PORT || 9080;

server.listen(
  PORT,
  console.log(`Server is running on the port number ${PORT}`)
);
