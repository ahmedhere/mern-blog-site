import express from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getPost,
  getPosts,
  likePost,
  updatePost,
} from "../../controllers/posts/postCtrl.js";
import isloggedin from "../../middlewares/isLoggedin.js";
import checkAccountVerification from "../../middlewares/isAccountVerified.js";
const postRouter = express.Router();

postRouter.post("/", isloggedin, checkAccountVerification, createPost);
postRouter.get("/", getPosts);

postRouter.put("/likes/:id", isloggedin, likePost);
postRouter.put("/dislikes/:id", isloggedin, dislikePost);

postRouter
  .route("/:id")
  .get(getPost)
  .delete(isloggedin, deletePost)
  .put(isloggedin, updatePost);

export default postRouter;
