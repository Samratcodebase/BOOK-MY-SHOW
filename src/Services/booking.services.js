import Booking from "../Models/booking.model.js";
import { statusCode } from "../Utils/constant.js";
const CreateBooking = async (payload) => {
  try {
    return await Booking.create(payload);
  } catch (err) {
    console.error("Booking creation failed:", err);

    err.statusCode = 400;
    err.success = false;
    throw err;
  }
};

export default { CreateBooking };
