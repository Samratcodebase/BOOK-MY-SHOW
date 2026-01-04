import Theatre from "../Models/theatre.model.js";

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

const DeleteTheatre = async () => {};

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
export default { createTheatre, DeleteTheatre, FetchTheatre };
