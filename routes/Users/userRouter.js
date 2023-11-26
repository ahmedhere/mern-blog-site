import express from "express";
import {
  FollowingUser,
  accountVerificationEmail,
  blockUser,
  forgotPassword,
  getProfile,
  login,
  regsiter,
  resetPassword,
  unFollowingUser,
  unblockUser,
  verifyAccount,
  viewProfile,
} from "../../controllers/users/usersCtrl.js";
import isLoggedin from "../../middlewares/isLoggedin.js";
const userRouter = express.Router();

userRouter.post("/register", regsiter);
userRouter.post("/login", login);

userRouter.put("/block/:userIdToBlock", isLoggedin, blockUser);
userRouter.put("/unblock/:userIdToUnBlock", isLoggedin, unblockUser);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:resetToken", resetPassword);

userRouter.put("/follow/:userToFollowId", isLoggedin, FollowingUser);
userRouter.put("/unfollow/:userTounFollowId", isLoggedin, unFollowingUser);

userRouter.get("/profile-viewer/:userProfileId", isLoggedin, viewProfile);
userRouter.get("/profile/:id", isLoggedin, getProfile);

//Account verification Routes
userRouter.post(
  "/account-verification-email",
  isLoggedin,
  accountVerificationEmail
);
userRouter.post(
  "/verify-account/:accountverificationId",
  isLoggedin,
  verifyAccount
);

export default userRouter;
