import bcrypt from "bcryptjs";
//@desc Register a new User
//@route POST /api/v1/users/register
//@access public
import User from "../../model/User/User.js";
import generateToken from "../../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import sendAccountVerificationEmail from "../../utils/sendAccountVerification.js";

export const regsiter = asyncHandler(async (req, res) => {
  //get the details
  const { username, password, email } = req.body;
  // ! Check if the user exists
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User Already Exists");
  }

  //! hash password

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashed,
  });

  await newUser.save();
  res.status(201).json({
    status: "Success",
    message: "User added successfully",
    _id: newUser?._id,
    username: newUser?.username,
    email: newUser?.email,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid Login Credentials");
  }
  // compare the hashed password with the one the request
  const isMatched = await bcrypt.compare(password, user?.password);
  if (!isMatched) {
    throw new Error("Invalid Login Credentials");
  }

  user.lastLogin = new Date();
  await user.save();
  res.json({
    status: "Success",
    token: generateToken(user),
    email: user?.email,
    username: user?.username,
    _id: user?._id,
    role: user?.role,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  res.json({
    status: "success",
    message: "Profile fetched",
    user,
  });
});

export const blockUser = asyncHandler(async (req, res) => {
  // Find the user to be blocked
  const userIdToBlock = req.params.userIdToBlock;
  const userToBlock = await User.findById(userIdToBlock);
  // ! user who is blocked
  const userBlocking = req.userAuth._id;
  // *If user is blocking him or her self
  if (userIdToBlock.toString() === userBlocking.toString()) {
    throw new Error("Cannot block yourself");
  }
  // find the current user
  const currentUser = await User.findById(userBlocking);
  // ?Check if user already blocked
  if (currentUser?.blockedUsers?.includes(userIdToBlock)) {
    throw new Error("User already blocked");
  }
  // push the user to be blocked in the array of the current user
  currentUser?.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  res.json({
    status: "success",
    message: "Successfully user blocked",
  });
});

export const unblockUser = asyncHandler(async (req, res) => {
  // Find the user to be blocked
  const { userIdToUnBlock } = req.params;
  const userUnblocking = req.userAuth?._id;
  const userToUnblock = await User.findById(userIdToUnBlock);
  if (!userToUnblock) {
    throw new Error("User to be unblock not found");
  }

  const currentUser = await User.findById(userUnblocking);
  if (!currentUser.blockedUsers.includes(userIdToUnBlock)) {
    throw new Error("User not blocked");
  }
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== userIdToUnBlock.toString()
  );

  await currentUser.save();
  res.json({
    status: "success",
    message: "Successfully user unblocked",
  });
});

export const viewProfile = asyncHandler(async (req, res) => {
  const { userProfileId } = req.params;
  const viewProfileUser = await User.findById(userProfileId);
  if (!viewProfileUser) {
    throw new Error("User to view his profile not found");
  }

  const currentUserId = req.userAuth._id;

  // ?Check if user already blocked
  if (viewProfileUser?.profileViewers?.includes(currentUserId)) {
    throw new Error("You have already viewed profile");
  }
  // push the user to be blocked in the array of the current user
  viewProfileUser?.profileViewers.push(userProfileId);
  await viewProfileUser.save();
  res.json({
    status: "success",
    message: "You have successfully viewed his/her profile",
  });
});

export const FollowingUser = asyncHandler(async (req, res) => {
  // Find the current user
  const currentUserId = req.userAuth._id;
  //! Find the user to follow

  const { userToFollowId } = req.params;
  //Avoid user following himself
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new Error("You cannot follow yourself");
  }
  //push the usertoFollowid into the current user following field
  await User.findByIdAndUpdate(currentUserId, {
    $addToSet: { following: userToFollowId },
  });

  await User.findByIdAndUpdate(userToFollowId, {
    $addToSet: { followers: currentUserId },
  });
  res.json({
    status: "success",
    message: "You followed the user successfully",
  });
});

export const unFollowingUser = asyncHandler(async (req, res) => {
  // Find the current user
  const currentUserId = req.userAuth._id;
  //! Find the user to follow

  const { userTounFollowId } = req.params;

  if (currentUserId.toString() === userTounFollowId.toString()) {
    throw new Error("You cannot unfollow yourself");
  }

  await User.findByIdAndUpdate(currentUserId, {
    $pull: { following: userTounFollowId },
  });

  await User.findByIdAndUpdate(userTounFollowId, {
    $pull: { followers: currentUserId },
  });
  res.json({
    status: "success",
    message: "You unfollowed the user successfully",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("There is no email in out system");
  }
  //create Token
  const resetToken = await userFound.generatePasswordResetToken();
  //resave the user

  await userFound.save();
  //send Email
  sendEmail(email, resetToken);
  res.status(200).json({
    message: "Password reset sent to your email",
    status: "success",
    resetToken,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  //Convert the token to actual token that has been saved in the db
  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // find the user by the crypto token
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    throw new Error("Password reset token is invalid or expired");
  }
  //Update the user password

  const salt = await bcrypt.genSalt(12);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetExpires = undefined;
  userFound.passwordResetToken = undefined;
  await userFound.save();
  res.json({
    message: "Password reset successfully",
    status: "success",
  });
});

// @route POST /api/v1/users/account-verification-email
// @desc send Account verification token over the email
// @access Private

export const accountVerificationEmail = asyncHandler(async (req, res) => {
  //Find the login user email

  const user = await User.findById(req?.userAuth?._id);
  if (!user) {
    throw new Error("User not found");
  }
  //send the token
  const token = await user.generateAccountVerificationToken();
  console.log(token);
  await user.save();
  // send email

  sendAccountVerificationEmail(user?.email, token);
  res.status(200).json({
    message: `Account verification email sent ${user?.email}`,
  });
});

// @route POST /api/v1/users/verify-account/:accountverificationId
// @desc verify the account by checking the sent password
// @access Private

export const verifyAccount = asyncHandler(async (req, res) => {
  const { accountverificationId } = req.params;

  const cryptoToken = crypto
    .createHash("sha256")
    .update(accountverificationId)
    .digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    throw new Error("Account verification token is invalid or expired");
  }
  userFound.isVerified = true;
  userFound.accountVerificationExpires = undefined;
  userFound.accountVerificationToken = undefined;

  await userFound.save();

  res.status(200).json({
    status: "success",
    message: "Account successfully verified",
  });
});
