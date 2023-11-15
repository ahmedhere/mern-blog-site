import express from "express";
import isloggedin from "../../middlewares/isLoggedin.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../controllers/comments/commentCtrl.js";
const commentRouter = express.Router();

commentRouter.post("/:postId", isloggedin, createComment);

commentRouter
  .route("/:id")
  .delete(isloggedin, deleteComment)
  .put(isloggedin, updateComment);

export default commentRouter;
