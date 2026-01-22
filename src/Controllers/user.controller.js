import userService from "../Services/user.services.js";
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const error = new Error("All Fileds Required");
      error.statuscode = 401;
      error.success = false;
      throw error;
    }

    const User = await userService.createUser(username, email, password);

    return res.status(201).json({
      Message: "User Registration SuccessFull",
      Success: True,
      Data: User,
    });
  } catch (error) {
    return res.status(error.statuscode).json({
      Message: error.Message,
      Success: error.success,
    });
  }
};

export default { signUp };
