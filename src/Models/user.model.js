import mongoose from "mongoose";
const ROLES = Object.freeze({
  CUSTOMER: "Customer",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
});
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.CUSTOMER,
  },
});

export default mongoose.model("User", UserSchema);
