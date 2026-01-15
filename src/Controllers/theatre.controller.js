import theatreService from "../Services/theatre.services.js";

const createTheatre = async (req, res) => {
  try {
    const { name, description, city, pincode, address } = req.body;

    if (!name || !description || !city || !pincode || !address) {
      res.status(404).json({
        message: "All fileds are required",
        sucess: false,
      });
    }

    const Theatre = await theatreService.createTheatre({
      name,
      description,
      city,
      pincode,
      address,
    });

    if (!Theatre) {
      res.status(500).json({
        message: "Internal Server Error",
        sucess: false,
      });
    }

    return res.status(201).json({
      message: "Theater Creation SucessFull",
      sucess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      sucess: true,
    });
  }
};

const getTheatres = async (req, res) => {
  try {
    let query = {};
    const { name, city, pincode } = req.query;

    if (name) {
      query.name = name;
    }
    if (city) {
      query.city = city;
    }
    if (pincode) {
      query.pincode = pincode;
    }

    const data = await theatreService.FetchTheatre(query);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTheatres = async (req, res) => {
  try {
    const theatreID = req.params.id;
    if (!theatreID) {
      const error = new Error("Required parameters are missing");
      error.statusCode = 400;

      throw error;
    }

    const removedTheatre = await theatreService.DeleteTheatre(theatreID);

    return res.status(200).json({
      message: "Theatre Deleted  SucessFull",
      success: true,
      data: removedTheatre,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
    });
  }
};
const updateTheatre = async (req, res) => {};
const theatreMoviesController = async (req, res) => {
  try {
    const theatreID = req.params.id;

    if (!theatreID) {
      const error = new Error("Theatre ID is Missing");
      error.statusCode = 401;
      error.sucess = false;
      throw error;
    }

    const { movies, insert } = req.body;

    const UpdatedTheatre = await theatreService.TheatreMoviesService(
      theatreID,
      movies,
      insert
    );

    res.status(200).json(UpdatedTheatre);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
export {
  createTheatre,
  getTheatres,
  deleteTheatres,
  theatreMoviesController,
  updateTheatre,
};
