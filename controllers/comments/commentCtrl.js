import Comment from "../../model/Comment/Comment.js";
import AsyncHandler from "express-async-handler";
import Post from "../../model/Post/Post.js";

export const createComment = AsyncHandler(async (req, res) => {
  const { message, author } = req.body;
  const { postId } = req.params;
  const comment = await Comment.create({
    message,
    author: req.userAuth?._id,
    posts: postId,
  });
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment?._id },
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Comment created successfully",
    comment,
  });
});

export const deleteComment = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Comment deleted Successfully",
  });
});
export const updateComment = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    id,
    {
      message: message,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Comment updated Successfully",
    comment,
  });
});
