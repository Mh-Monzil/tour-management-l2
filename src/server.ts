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

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection detected... Server shutting down...", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// if don't use try catch then
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception detected... Server shutting down...", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Uncaught Exception detected... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination error
 */
