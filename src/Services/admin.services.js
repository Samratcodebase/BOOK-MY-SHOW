import User from "../Models/user.model.js";
import { statusCode } from "../Utils/constant.js";
const updateUser = async (userId, role) => {
  const response = await User.findOne({ _id: userId });
  if (!response) {
    const error = new Error("Invalid User ID");
    error.statusCode = statusCode.BAD_REQUEST;
    error.success = false;
  }

  response.role = role;
  await response.save();

  return response.role === role;
};

export default { updateUser };
