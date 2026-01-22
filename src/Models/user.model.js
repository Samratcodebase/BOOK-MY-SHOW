import mongoose from "mongoose";
const ROLES = Object.freeze({
  USER: "User",
  CLIENT: "Client",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
});
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 10,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    userStatus: {
      type: String,
      required: true,
      default: "APPOVED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
