import Category from "../../model/Category/Category.js";
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;
  const categroyFound = await Category.findOne({ name });
  if (categroyFound) {
    throw new Error("Category already exists");
  }
  const category = await Category.create({
    name: name,
    author: req.userAuth?._id,
  });
  res.status(201).json({
    status: "success",
    message: "Category successfully created",
    category,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    status: "success",
    message: "Categories successfully fetched",
    categories,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Categories successfully fetched",
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Categories successfully updated",
    category,
  });
});
