import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
const createUser = async (username, email, password) => {
  const isExists = await User.findOne({ email });
  if (isExists) {
    const error = new Error("User Already Exists");
    error.statusCode = 409;
    error.success = false;
    throw error;
  }

  const user = await User.create({ username, email, password });

  if (!user) {
    const error = new Error("Internal Service Error");
    error.statusCode = 500;
    error.success = false;
    throw error;
  }

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 409;
    error.success = false;
    throw error;
  }

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 409;
    error.success = false;
    throw error;
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  console.log(jwt.verify(token, process.env.JWT_SECRET));

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },

    token,
  };
};

export default { createUser, loginUser };
