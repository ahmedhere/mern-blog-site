import bcrypt from "bcryptjs";
//@desc Register a new User
//@route POST /api/v1/users/register
//@access public
import User from "../../model/User/User.js";
import generateToken from "../../utils/generateToken.js";

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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid Login Credentials");
    }
    // compare the hashed password with the one the request
    const isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
      throw new Error("Invalid Login Credentials");
    }

    user.lastLogin = new Date();
    res.json({
      status: "Success",
      token: generateToken(user),
      email: user?.email,
      username: user?.username,
      _id: user?._id,
      role: user?.role,
    });
    await user.save();
  } catch (err) {
    res.json({
      status: "failed",
      message: err?.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Profile fetched",
      data: "user data",
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err?.message,
    });
  }
};
