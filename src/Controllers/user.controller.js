import userService from "../Services/user.services.js";
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const error = new Error("All Fileds Required");
      error.statusCode = 401;
      error.success = false;
      throw error;
    }

    const User = await userService.createUser(username, email, password);

    return res.status(201).json({
      Message: "User Registration SuccessFull",
      Success: true,
      Data: User,
    });
  } catch (error) {
    const statusCode = Number(error && error.statusCode) || 500;
    const success =
      typeof (error && error.success) === "boolean" ? error.success : false;
    return res.status(statusCode).json({
      Message: error && error.message ? error.message : "Internal Server Error",
      Success: success,
    });
  }
};

const singIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All Fileds Required");
      error.statusCode = 401;
      error.success = false;
      throw error;
    }

    const User = await userService.loginUser(email, password);

    return User;
  } catch (error) {}
};

export default { signUp, singIn };
