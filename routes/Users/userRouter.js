import express from "express";
import { regsiter } from "../../controllers/users/usersCtrl.js";
const userRouter = express.Router();

userRouter.post("/api/v1/users/register", regsiter);

export default userRouter;
