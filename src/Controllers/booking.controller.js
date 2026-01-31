import bookingService from "../Services/booking.services.js";
import { statusCode } from "../Utils/constant.js";
const createBooking = async (req, res) => {
  try {
    console.log("inside controller");

    let userId = req.user.id;
    const x = { userId, ...req.body };

    console.log(x);

    const booking = await bookingService.createBooking({ ...req.body, userId });
  } catch (error) {
    return res
      .status(
        Number((error && error.statusCode) || statusCode.INTERNAL_SERVER_ERROR),
      )
      .json({
        messagee: error.messagee,
        sucess: error.sucess,
      });
  }
};

export default { createBooking };
