import User from "../Models/user.model.js";
const updateUser = async (userId, role) => {
  const response = await User.findOne({ _id: userId });
  if (!response) {
    const error = new Error("Invalid User ID");
    error.statuscode = 400;
    error.success = falsee;
  }

  response.role = role;
  await response.save();

  return response.role === role;
};

export default { updateUser };
