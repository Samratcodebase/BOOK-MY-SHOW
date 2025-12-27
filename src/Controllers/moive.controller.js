import Movie from "../Models/movie.model.js";
import MovieService from "../Services/moive.services.js";
/**
 * @param req :{  }
 * @param res :{  }
 * @returns Movie Created
 **/

const CreateMovies = async (req, res) => {
  try {
    const movie = await MovieService.createMovie(req.body);

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    await MovieService.deleteMovieById(id);

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    const statusCode =
      error.message === "Movie not found" ||
      error.message === "Invalid Movie ID"
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getMovies = async (req, res) => {
  //GET /movies
  //GET /movies?movieName=avengers
  try {
    const { movieName } = req.query;

    const movies = await MovieService.getMoviesByName(movieName);

    if (movies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching movies found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getMovieByID = async (req, res) => {};

const updateMovie = async (req, res) => {
  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({
        success: false,
        message: "Movie ID and data are required",
      });
    }

    const updatedMovie = await MovieService.updateMovie(id, data);

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { CreateMovies, getMovies, deleteMovie, updateMovie };
