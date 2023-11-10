import express from "express";
import {
  getProfile,
  login,
  regsiter,
} from "../../controllers/users/usersCtrl.js";
import isLoggedin from "../../middlewares/isLoggedin.js";
const userRouter = express.Router();

userRouter.post("/register", regsiter);
userRouter.post("/login", login);

userRouter.get("/profile/:id", isLoggedin, getProfile);

export default userRouter;
