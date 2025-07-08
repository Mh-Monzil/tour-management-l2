import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dev_monzil:ma7JEpR2chybZbFz@cluster0.j6yhdqz.mongodb.net/tour-management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");

    server = app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination error
 */
