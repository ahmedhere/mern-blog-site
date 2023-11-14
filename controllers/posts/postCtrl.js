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
  const posts = await Post.find({});
  res.status(200).json({
    status: "success",
    message: "Posts successfully fetched",
    posts,
  });
});

export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
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
