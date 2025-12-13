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

export default { createMovie };
