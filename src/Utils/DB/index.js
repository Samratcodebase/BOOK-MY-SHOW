import "dotenv/config";
import mongoose from "mongoose";

const ConnectToDB = async (req, res) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB  Server is Connected");
    })
    .catch((err) => {
      console.log("Error Connecting the DB", err);
    });
};

export default ConnectToDB;
