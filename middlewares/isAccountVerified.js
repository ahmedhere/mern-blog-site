import User from "../model/User/User.js";

const checkAccountVerification = async (req, res, next) => {
  try {
    //Find the loggedIn user
    const user = await User.findById(req?.userAuth?._id);
    //   check if user is verified
    if (user?.isVerified) {
      next();
    } else {
      return res.status(401).json({ message: "Account not verified" });
    }
  } catch (ex) {
    throw new Error(`Server Error: ${ex}`);
  }
};

export default checkAccountVerification;
