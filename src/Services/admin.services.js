import User from "../Models/user.model.js";
import Show from "../Models/show.model.js";
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
const createShow = async (payload) => {
  try {
    const show = await Show.create(payload);
    if (!show) {
      const error = new Error("Internal Server Error");
      error.statuscode = statusCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export default { updateUser, createShow };
