import mongoose from "mongoose";
import serverConfig from "./serverConfig.js"; 

export const dbConnect = async () => {
  try {
    await mongoose.connect(serverConfig.mongoURI, {
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
