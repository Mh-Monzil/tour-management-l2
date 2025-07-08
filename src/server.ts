/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to MongoDB");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
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
