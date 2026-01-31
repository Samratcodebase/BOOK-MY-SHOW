import mongoose from "mongoose";
import paymentStatus from "../Utils/constant.js";
const paymentSchema = new mongoose.Schema(
  {
    bookingID: {
      type: mongoose.Types.Schema.ObjectId,
      required: true,
      ref: "Bookings",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(paymentStatus),
      default: paymentStatus.PENDING,
    },
  },
  { timestamps: true },
);

const PaymentModel = mongoose.model("Payment", paymentSchema);

export default PaymentModel;
