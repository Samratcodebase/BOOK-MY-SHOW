// Import the service layer that handles business logic / DB interaction
import showServices from "../Services/show.services.js";

// Import predefined HTTP status codes to avoid magic numbers
import { statusCode } from "../Utils/constant";

// Controller function to fetch shows based on query params
const getShows = async (req, res) => {
  try {
    // Extract filters from query string
    // Example: /shows?theatreID=123&movieID=456
    const { theatreID, movieID } = req.query;

    // Call service layer to get matching shows
    // Controller should NOT contain DB logic — good separation here
    const response = await showServices.getShow(theatreID, movieID);

    // Send successful response
    res.status(statusCode.OK).json({
      message: "Match Found",
      data: response,
    });
  } catch (error) {
    // Fallback to 500 if error status code is missing or invalid
    return res
      .status(
        Number(error && error.statuscode) || statusCode.INTERNAL_SERVER_ERROR
      )
      .json({
        // Send error message to client
        // Be careful in production: don’t leak internal error details
        message: error.message,
      });
  }
};

// Export controller as an object (scales better when adding more handlers)
export default { getShows };
