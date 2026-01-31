import mongoose from "mongoose";
import { bookingStatus } from "../Utils/constant.js";
const bookingSchema = new mongoose.Schema(
  {
    theatreID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    movieID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movies",
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    timing: {
      type: String,
      required: true,
    },
    noOfseats: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(bookingStatus),
        message: "Invalid Booking Status",
      },
      default: bookingStatus.IN_PROCESS,
    },
  },
  { timestamps: true },
);

const BookingModel = mongoose.model("Bookings", bookingSchema);

export default BookingModel;
