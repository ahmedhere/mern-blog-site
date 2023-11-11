import express from "express";
import isloggedin from "../../middlewares/isLoggedin.js";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../../controllers/categories/categoriesCtrl.js";
const categoryRoute = express.Router();

categoryRoute.post("/", isloggedin, createCategory);
categoryRoute.get("/", getCategories);

categoryRoute
  .route("/:id")
  .delete(isloggedin, deleteCategory)
  .put(isloggedin, updateCategory);

export default categoryRoute;
