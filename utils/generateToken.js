import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
    },
  };

  // * sign the token with the a jwt

  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 36000,
  });

  return token;
};

export default generateToken;
