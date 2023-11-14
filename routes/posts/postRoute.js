import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../../controllers/posts/postCtrl.js";
import isloggedin from "../../middlewares/isLoggedin.js";
const postRouter = express.Router();

postRouter.post("/", isloggedin, createPost);
postRouter.get("/", getPosts);

postRouter
  .route("/:id")
  .get(getPost)
  .delete(isloggedin, deletePost)
  .put(isloggedin, updatePost);

export default postRouter;
