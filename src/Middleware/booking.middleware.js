import { statusCode } from "../Utils/constant.js";
import theatreServices from "../Services/theatre.services.js";
import moiveServices from "../Services/moive.services.js";
const validateBookingRequest = async (req, res, next) => {
  const { theatreID, movieID, timing, noOfseats } = req.body;

  if (!theatreID) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Theatre ID missing",
    });
  }
  if (!movieID) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Movie ID missing",
    });
  }

  if (!timing) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Timing missing",
    });
  }
  if (!noOfseats) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Seat is  missing",
    });
  }

  const isTheatreExists = await theatreServices.getTheatreByID(theatreID);
  if (!isTheatreExists) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Not Theatre Exist ",
    });
  }

  const isMovieExists = await moiveServices.getMovieByID(movieID);
  if (!isMovieExists) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Not Theatre Exist ",
    });
  }

  next();
};

export default { validateBookingRequest };
