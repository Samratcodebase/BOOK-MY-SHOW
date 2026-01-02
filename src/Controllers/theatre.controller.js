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

export { createTheatre };
