import mongoose from "mongoose";
import { mongoURI } from "../secret.js";

export const connectDB = async (option = {}) => {
  try {
    await mongoose.connect(mongoURI, option);
    console.log("Database Connection succesful");
    mongoose.connection.on("error", (error) => {
      console.error(`DB Connection Error: ${error}`);
    });
  } catch (error) {
    console.error(`Could Not DB Connection: ${error}`);
  }
};
