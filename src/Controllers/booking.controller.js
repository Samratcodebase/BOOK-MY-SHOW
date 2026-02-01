import bookingService from "../Services/booking.services.js";
import userServices from "../Services/user.services.js";
import { statusCode } from "../Utils/constant.js";
console.log("bookingService keys:", Object.keys(bookingService));

const createBooking = async (req, res) => {
  try {
    console.log("inside controller");

    let userID = req.user.id;
    const x = { userID, ...req.body };

    console.log(x);

    const booking = await bookingService.CreateBooking(x);
    console.log("Hit");
    const updateUser = await userServices.addBookingToUser(userID, booking._id);
    return res.status(statusCode.OK).json({
      messagee: "Booking SuccessFull",
      data: booking,
      user: updateUser,
    });
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
