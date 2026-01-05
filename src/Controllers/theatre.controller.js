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
    const { name } = req.params;

    const data = await theatreService.FetchTheatre(name);

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
      return res.status(400).json({
        message: "Required parameters are missing",
        sucess: false,
      });
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
export { createTheatre, getTheatres, deleteTheatres };
