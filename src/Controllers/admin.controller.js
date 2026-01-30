import AdminService from "../Services/admin.services.js";
const updateUser = async (req, res) => {
  const userID = req.params.id;
  const role = req.body.role;

  try {
    const response = await AdminService.updateUser(userID, role);

    res.status(200).json({
      message: "User Role Upgradation Complete",
      data: response,
    });
  } catch (error) {
    res.status(Number(error && error.statuscode) || 500).json({
      message: error.message,
      success:
        typeof error && error.success == "boolen" ? error.success : false,
    });
  }
};

export default { updateUser };
