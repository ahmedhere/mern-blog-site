import express from "express";
import {
  FollowingUser,
  blockUser,
  getProfile,
  login,
  regsiter,
  unFollowingUser,
  unblockUser,
  viewProfile,
} from "../../controllers/users/usersCtrl.js";
import isLoggedin from "../../middlewares/isLoggedin.js";
const userRouter = express.Router();

userRouter.post("/register", regsiter);
userRouter.post("/login", login);

userRouter.put("/block/:userIdToBlock", isLoggedin, blockUser);
userRouter.put("/unblock/:userIdToUnBlock", isLoggedin, unblockUser);
userRouter.put("/follow/:userToFollowId", isLoggedin, FollowingUser);

userRouter.put("/unfollow/:userTounFollowId", isLoggedin, unFollowingUser);

userRouter.get("/profile-viewer/:userProfileId", isLoggedin, viewProfile);
userRouter.get("/profile/:id", isLoggedin, getProfile);

export default userRouter;
