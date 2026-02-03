import mongoose from "mongoose";
const showSchema = new mongoose.Schema(
  {
    theatreID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    movieID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
      required: true,
    },
    startTime: {
      type: String, 
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Show", showSchema);
