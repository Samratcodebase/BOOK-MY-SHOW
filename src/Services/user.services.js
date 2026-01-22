import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = User.create({ username, email, hashedPassword });

  if (!user) {
    const error = new Error("Internal Service Error");
    error.statuscode = 404;
    error.success = false;
    throw error;
  }

  return user;
};

export default { createUser };
