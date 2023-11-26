import mongoose from "mongoose";
import crypto from "crypto";
// Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationPreferences: {
      email: { type: String, default: true },
      //..other notifications (sms)
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
    },
    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//! Gemerate password reset option method
userSchema.methods.generatePasswordResetToken = function () {
  //generateToken
  const resetToken = crypto.randomBytes(20).toString("hex");
  //assign the token to passwordResetToken
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //update password reset expires option
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//compile schema to model

const User = mongoose.model("User", userSchema);

export default User;
