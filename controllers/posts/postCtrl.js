import asyncHandler from "express-async-handler";
import Post from "../../model/Post/Post.js";
import User from "../../model/User/User.js";
import Category from "../../model/Category/Category.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, image, content, categoryId, author } = req.body;

  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("Post already exists");
  }
  //check if the user account if verified
  const post = await Post.create({
    title,
    image,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });

  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Successfully created",
    post,
  });
});

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("comments");
  res.status(200).json({
    status: "success",
    message: "Posts successfully fetched",
    posts,
  });
});

export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");
  res.status(200).json({
    status: "success",
    message: "Post successfully fetched",
    post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Post successfully deleted",
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(
    id,
    {
      title: req.body?.title,
      image: req.body?.image,
      content: req.body?.content,
      category: req.body?.categoryId,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Post successfully deleted",
    post,
  });
});

// @desc Liking a post
// @route Put /api/v1/posts/likes/:id
// @access private

export const likePost = asyncHandler(async (req, res) => {
  //get Id of the post
  const { id } = req.params;
  // get the logged in user
  const UserId = req?.userAuth?._id;
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  // check if the user already liked the post
  const userHasLiked = post.likes.some((like) => like.toString() === UserId);
  if (userHasLiked) {
    throw new Error("User has already liked this post");
  }
  // Push the user into the post likes
  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: UserId },
    },
    {
      new: true,
    }
  );
  // remove the user from the dislikes array if present
  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== UserId.toString()
  );
  await post.save();
  res.status(200).json({ message: "Post liked successfully" });
});

export const dislikePost = asyncHandler(async (req, res) => {
  //get Id of the post
  const { id } = req.params;
  // get the logged in user
  const UserId = req?.userAuth?._id;
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  // check if the user already disliked the post
  const userHasLiked = post.dislikes.some((like) => like.toString() === UserId);
  if (userHasLiked) {
    throw new Error("User has already liked this post");
  }
  // Push the user into the post likes
  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { dislikes: UserId },
    },
    {
      new: true,
    }
  );
  // remove the user from the dislikes array if present
  post.likes = post.likes.filter(
    (like) => like.toString() !== UserId.toString()
  );
  await post.save();
  res.status(200).json({ message: "Post disliked successfully" });
});
