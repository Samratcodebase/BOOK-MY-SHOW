import Show from "../Models/show.model.js";
import { statusCode } from "../Utils/constant";
const getShow = async (payload) => {
  let query;
  const { theatreId, movieId } = payload;
  if (theatreId != null && theatreId != undefined && theatreId != NaN) {
    query.theatreId;
  }

  if (movieId != null && movieId != undefined && movieId != NaN) {
    query.movieId;
  }
  console.log("Show Query Object", query);

  const show = await Show.find(query);

  if (show.length == 0) {
    const error = new Error("No Matching Show Found");
    error.statuscode = statusCode.BAD_REQUEST;
    throw error;
  }

  return show;
};

//Need to Implement the Thearte Sync
//getThratre to Shows

export default { getShow };
