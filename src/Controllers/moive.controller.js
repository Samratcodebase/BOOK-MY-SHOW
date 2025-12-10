import Movie from "../Models/movie.model.js";

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

export { CreateMovies };
