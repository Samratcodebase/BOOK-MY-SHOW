import showServices from "../Services/show.services.js";
import { statusCode } from "../Utils/constant";
const getShows = async (req, res) => {
  try {
    const { theatreID, movieID } = req.query;
    const response = await showServices.getShow(theatreID, movieID);

    res.status(statusCode.OK).json({
      message: "Match Found",
      data: response,
    });
  } catch (error) {
    return res
      .status(
        Number(error && error.statuscode) || statusCode.INTERNAL_SERVER_ERROR,
      )
      .json({
        message: error.message,
      });
  }
};

export default {getShows}