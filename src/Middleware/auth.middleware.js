import jwt from "jsonwebtoken";
const ValidateSignUpRequest = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "username, email, and password are required",
    });
  }

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data types",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (password.length < 10) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 10 characters long",
    });
  }

  next();
};

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    const response = jwt.verify(token, process.env.JWT_SECRET);

    req.user = response;
    next();
  } catch (error) {
    return res.status(400).json({
      Error: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
};
export default { ValidateSignUpRequest, isAuthenticated };
