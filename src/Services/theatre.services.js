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

const FetchTheatre = async (name) => {
  if (!name) {
    return await Theatre.find({});
  }

  const theatre = await Theatre.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (!theatre) {
    const error = new Error("Theatre not found");
    error.statusCode = 404;
    throw error;
  }

  return theatre;
};

const TheatreMoviesService = async (theatreID, movies, flag) => {
  let theatre = await Theatre.findOne({ _id: theatreID });

  if (!theatre) {
    throw new Error("Internal Server Error");
  }

  if (!flag) {
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
  return theatre;
};
export default {
  createTheatre,
  DeleteTheatre,
  FetchTheatre,
  TheatreMoviesService,
};
