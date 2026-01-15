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

const FetchTheatre = async (query, movieID = null) => {
  const theatres = await Theatre.find(query).populate("movies");

  //theatres.lenght is 0 if Empty array  So !theatre.length ==true
  if (!theatres.length) {
    const error = new Error("Theatre not found");
    error.statusCode = 404;
    throw error;
  }

  if (!movieID) {
    return theatres;
  }

  if (movieID) {
    // Filter theatres to only include the movie matching movieID
    const filteredTheatres = theatres
      .map((theatre) => {
        const matchingMovies = theatre.movies.filter((movie) =>
          movie._id.equals(movieID)
        );

        if (matchingMovies.length > 0) {
          return {
            ...theatre.toObject(), // convert Mongoose document to plain object
            movies: matchingMovies,
          };
        }

        return null; // no matching movies in this theatre
      })
      .filter(Boolean); // remove theatres with no matching movies

    return filteredTheatres;
  }
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
      { new: true }
    );
  } else {
    theatre = await Theatre.findByIdAndUpdate(
      theatreID,
      {
        $addToSet: {
          movies: { $each: movies },
        },
      },
      { new: true }
    );
  }

  if (!theatre) {
    throw new Error("Internal Server Error");
  }
  theatre = await theatre.populate("movies");
  return theatre;
};
export default {
  createTheatre,
  DeleteTheatre,
  FetchTheatre,
  TheatreMoviesService,
};
