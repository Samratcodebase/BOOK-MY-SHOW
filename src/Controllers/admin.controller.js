import AdminService from "../Services/admin.services.js";
import { statusCode } from "../Utils/constant.js";
const updateUser = async (req, res) => {
  const userID = req.params.id;
  const role = req.body.role;

  try {
    const response = await AdminService.updateUser(userID, role);

    res.status(statusCode.OK).json({
      message: "User Role Upgradation Complete",
      data: response,
    });
  } catch (error) {
    res
      .status(
        Number(error && error.statuscode) || statusCode.INTERNAL_SERVER_ERROR,
      )
      .json({
        message: error.message,
        success:
          typeof error && error.success == "boolen" ? error.success : false,
      });
  }
};
const createShows = async (req, res) => {
  try {
    const {
      theatreID,
      movieID,
      totalSeats,
      pricePerSeat,
      startTime,
      availableSeats,
    } = req.body;

    const show = await AdminService.createShow({
      theatreID,
      movieID,
      totalSeats,
      availableSeats,
      pricePerSeat,
      startTime,
    });
    console.log("Hit");
    return res.status(statusCode.OK).json({
      message: "Show Creation Successfull",
      data: show,
    });
  } catch (error) {
    res
      .status(
        Number(error && error.statuscode) || statusCode.INTERNAL_SERVER_ERROR,
      )
      .json({
        message: error.message,
        success:
          typeof error && error.success == "boolen" ? error.success : false,
      });
  }
};
export default { updateUser, createShows };
