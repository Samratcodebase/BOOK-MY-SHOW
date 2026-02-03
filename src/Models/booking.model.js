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
      enum: Object.values(bookingStatus),

      default: bookingStatus.IN_PROCESS,
    },
  },
  { timestamps: true },
);

const BookingModel = mongoose.model("booking", bookingSchema);

export default BookingModel;
