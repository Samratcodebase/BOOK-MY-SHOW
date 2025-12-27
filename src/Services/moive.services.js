import mongoose from "mongoose";
import Movie from "../Models/movie.model.js";
const createMovie = async (data) => {
  const {
    movieName,
    description,
    casts,
    trailerUrl,
    language,
    releaseDate,
    director,
    releaseStatus,
  } = data;

  if (
    !movieName ||
    !description ||
    !Array.isArray(casts) ||
    casts.length === 0 ||
    !trailerUrl ||
    !releaseDate ||
    !director
  ) {
    throw { statusCode: 400, message: "Invalid or missing fields" };
  }

  const existingMovie = await Movie.findOne({ movieName });
  if (existingMovie) {
    throw { statusCode: 409, message: "Movie already exists" };
  }

  return await Movie.create({
    movieName,
    description,
    casts,
    trailerUrl,
    language,
    releaseDate,
    director,
    releaseStatus,
  });
};

const updateMovie = async (movieID, data) => {
  if (!mongoose.Types.ObjectId.isValid(movieID)) {
    throw new Error("Invalid Movie ID");
  }

  const allowedFields = [
    "movieName",
    "description",
    "casts",
    "trailerUrl",
    "language",
    "releaseDate",
    "director",
  ];

  const updatePayload = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No valid fields to update");
  }

  const updatedMovie = await Movie.findByIdAndUpdate(movieID, updatePayload, {
    new: true, // return updated doc
    runValidators: true, // enforce schema rules
  });

  if (!updatedMovie) {
    throw new Error("Movie not found");
  }

  return updatedMovie;
};
const deleteMovieById = async (movieID) => {
  if (!mongoose.Types.ObjectId.isValid(movieID)) {
    throw new Error("Invalid Movie ID");
  }

  const deletedMovie = await Movie.findByIdAndDelete(movieID);

  if (!deletedMovie) {
    throw new Error("Movie not found");
  }

  return deletedMovie;
};
const getMoviesByName = async (movieName) => {
  const filter = movieName
    ? { movieName: { $regex: movieName, $options: "i" } }
    : {};

  const movies = await Movie.find(filter);

  return movies;
};
export default { createMovie, updateMovie, deleteMovieById, getMoviesByName };
