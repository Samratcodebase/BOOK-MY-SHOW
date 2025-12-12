import Movie from "../Models/movie.model.js";
/**
 * @param req :{  }
 * @param res :{  }
 * @returns Movie Created
 **/

const CreateMovies = async (req, res) => {
  try {
    const {
      movieName,
      description,
      casts,
      trailerUrl,
      language,
      releaseDate,
      director,
      releaseStatus,
    } = req.body;

    if (
      !movieName ||
      !description ||
      !casts ||
      !trailerUrl ||
      !releaseDate ||
      !director
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const createdMovie = await Movie.create({
      movieName,
      description,
      casts,
      trailerUrl,
      language,
      releaseDate,
      director,
      releaseStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: createdMovie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
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
