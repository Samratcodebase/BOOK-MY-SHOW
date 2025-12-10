import mongoose from "mongoose";
const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    casts: {
      type: [String],
      required: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
      default: "English",
    },

    releaseDate: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },

    releaseStatus: {
      type: String,
      required: true,
      default: "RELESED",
    },
  },
  { timestamps: true }
);

const movie = mongoose.model(movieSchema);

export default movie;
