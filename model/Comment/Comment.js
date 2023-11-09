import mongoose from "mongoose";

// Schema
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//compile schema to model

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
