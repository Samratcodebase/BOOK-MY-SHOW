import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
const createUser = async (username, email, password) => {
  const isExists = await User.findOne({ email });
  if (isExists) {
    const error = new Error("User Already Exists");
    error.statusCode = 409;
    error.success = false;
    throw error;
  }

  password = await bcrypt.hash(password, 10);

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

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 409;
    error.success = false;
    throw error;
  }

  return user;
};

export default { createUser, loginUser };
