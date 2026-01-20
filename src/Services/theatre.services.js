import Theatre from "../Models/theatre.model.js";

import mongoose from "mongoose";
const createTheatre = async (payload) => {
  const { name, description, city, pincode, address } = payload;

  let theatre = await Theatre.findOne({ name: name });

  if (theatre) {
    throw new Error("Allready Registered");
  }

  theatre = await Theatre.create({ name, description, city, pincode, address });
  if (!theatre) {
    throw new Error("Internal ServerError", 500);
  }
  return theatre;
};

const DeleteTheatre = async (theatreID) => {
  if (!mongoose.Types.ObjectId.isValid(theatreID)) {
    throw new Error("Invalid Theatre ID");
  }

  const deletedTheatre = await Theatre.findByIdAndDelete(theatreID);

  if (!deletedTheatre) {
    const error = new Error("Internal Service Error");
    error.statusCode = 500;
    throw error;
  }

  return deletedTheatre;
};

const FetchTheatre = async (query) => {
  const theatres = await Theatre.find(query).populate("movies");

  //theatres.lenght is 0 if Empty array  So !theatre.length ==true
  if (!theatres.length) {
    const error = new Error("Theatre not found");
    error.statusCode = 404;
    throw error;
  }

  return theatres;
};

/**
 *
 * @param  theatreID -->unique id of the theatre for which we want to update movies
 * @param  movies -->array of movieID  that are exprected to be updated in  theatre
 * @param  insert -->boolean that tells whether we want to insert movies or remove them
 * @returns --> updated theatre Document
 */
const TheatreMoviesService = async (theatreID, movies, insert) => {
  let theatre = await Theatre.findOne({ _id: theatreID });

  if (!theatre) {
    throw new Error("Internal Server Error");
  }

  if (!insert) {
    theatre = await Theatre.findByIdAndUpdate(
      theatreID,
      {
        $pull: {
          movies: { $in: movies },
        },
      },
      { new: true },
    );
  } else {
    theatre = await Theatre.findByIdAndUpdate(
      theatreID,
      {
        $addToSet: {
          movies: { $each: movies },
        },
      },
      { new: true },
    );
  }

  if (!theatre) {
    throw new Error("Internal Server Error");
  }
  theatre = await theatre.populate("movies");
  return theatre;
};
const updateTheatre = async (theatreID, data) => {
  const theatre = await Theatre.findOneAndUpdate({ _id: theatreID }, data, {
    new: true,
  });

  if (!theatre) {
    throw new Error("Internal Server Error");
  }

  return await theatre.populate("movies");
};
const getMoviesInTheatre = async (theatreID, movieID) => {
  const theatreObjectId = new mongoose.Types.ObjectId(theatreID);

  // normalize movie id
  const movieObjectId =
    movieID && mongoose.Types.ObjectId.isValid(movieID)
      ? new mongoose.Types.ObjectId(movieID)
      : null;

  /**
   * CASE 1: NO movieID
   * → return full theatre
   * → populate movies
   */
  if (!movieObjectId) {
    const theatre = await Theatre.findById(theatreObjectId).populate("movies"); // 👈 requirement satisfied

    if (!theatre) {
      const err = new Error("Theatre not found");
      err.statusCode = 404;
      throw err;
    }

    return theatre;
  }

  /**
   * CASE 2: theatreID + movieID
   * → aggregation
   * → return only matched movie
   */
  const pipeline = [
    { $match: { _id: theatreObjectId } },

    {
      $project: {
        name: 1,
        location: 1,
        movies: {
          $filter: {
            input: "$movies",
            as: "m",
            cond: { $eq: ["$$m", movieObjectId] },
          },
        },
      },
    },

    // drop theatre if movie not found
    { $match: { movies: { $ne: [] } } },

    /**
     * OPTIONAL: populate the single movie
     * (since aggregate doesn't support populate)
     */
    {
      $lookup: {
        from: "movies",
        localField: "movies",
        foreignField: "_id",
        as: "movies",
      },
    },
  ];

  const result = await Theatre.aggregate(pipeline);

  if (result.length === 0) {
    const err = new Error("Theatre or Movie not found");
    err.statusCode = 404;
    throw err;
  }

  return result[0];
};

export default {
  createTheatre,
  DeleteTheatre,
  FetchTheatre,
  TheatreMoviesService,
  updateTheatre,
  getMoviesInTheatre,
};
