import Movie from "../Models/movie.model.js";
import MovieService from "../Services/moive.services.js";
/**
 * @param req :{  }
 * @param res :{  }
 * @returns Movie Created
 **/

const CreateMovie = async (req, res) => {
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
    const movieID = req.params.id;

    if (!movieID) {
      return res.status(400).json({
        success: false,
        message: "Movie ID required",
      });
    }

    const movie = await Movie.findByIdAndDelete({ _id: movieID });

    if (!movie) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie Deletion SucessFull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getMovies = async (req, res) => {
  try {
    const movieName = req.body.movieName;

    const movie = await Movie.find({ movieName: movieName });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "No Matching Movie",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Moive Found",
      Movie: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getMovieByID = async (req, res) => {};

export { CreateMovies, getMovies, deleteMovie };
