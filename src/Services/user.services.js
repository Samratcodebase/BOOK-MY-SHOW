import User from "../Models/user.model.js";
const createUser = async (username, email, password) => {
  const user = User.create({ username, email, password });

  if (!user) {
    const error = new Error("Internal Service Error");
    error.statuscode = 404;
    error.success = false;
    throw error;
  }

  return user;
};

export default { createUser };
