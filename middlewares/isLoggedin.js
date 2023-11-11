import jwt from "jsonwebtoken";
import User from "../model/User/User.js";

export default function isloggedin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  // ? verify the token
  jwt.verify(token, process.env.SECRET, async (err, decode) => {
    if (err) {
      const err = new Error("Token expired/Invalid");
      next(err);
    } else {
      const userId = decode?.user?.id;
      const user = await User.findById(userId).select(
        "username email role _id"
      );
      req.userAuth = user;
      next();
    }
  });
}
