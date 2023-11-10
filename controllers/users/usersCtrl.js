import bcrypt from "bcryptjs";
//@desc Register a new User
//@route POST /api/v1/users/register
//@access public

import User from "../../model/User/User.js";

export const regsiter = async (req, res) => {
  try {
    //get the details
    const { username, password, email } = req.body;
    // ! Check if the user exists
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("User Already Exists");
    }

    //! hash password

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashed,
    });

    await newUser.save();
    res.status(201).json({
      status: "Success",
      message: "User added successfully",
      _id: newUser?._id,
      username: newUser?.username,
      email: newUser?.email,
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err?.message,
    });
  }
};
