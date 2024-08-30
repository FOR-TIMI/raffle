require("dotenv").config();

import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Server } from "http";
import deserializeUser from "./middleware/deserialize";
import purify from "./middleware/domPurify";
import sanitizerMongo from "./middleware/sanitize";
import router from "./routes";
import connectDB from "./utils/Db";
import { errorHandler } from "./utils/Error/request-handler";
import log from "./utils/Logger";

const app = express();
const port = config.get<number>("port");
const baseRoute = config.get<string>("baseRoute");

// cookie parser
app.use(cookieParser());

const helmetConfig = config.get<object>("helmetConfig");

// Security middleware
app.use(helmet(helmetConfig));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate limiting
const rateLimitConfig = config.get<object>("rateLimitConfig");
const limiter = rateLimit(rateLimitConfig);

app.use(sanitizerMongo());
app.use(purify());
app.use(limiter);

// CORS configuration
const corsOptions = config.get<object>("corsConfig");

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

app.options("*", (req, res) => {
  console.log("Handling OPTIONS request");
  res.sendStatus(200);
});

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Custom middleware
app.use(deserializeUser);

// Routes
app.use(baseRoute, router);

// Error handling middleware
app.use(errorHandler);

// Start server only if database connection is successful
let server: Server | null = null;
connectDB()
  .then(() => {
    server = app.listen(port, () => {
      log.info(`App is running on port ${port}`);
    });
  })
  .catch((error) => {
    log.error("Failed to connect to the database", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  log.info("SIGTERM signal received: closing HTTP server");
  if (server) {
    server.close(() => {
      log.info("HTTP server closed");
    });
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  log.error("Uncaught Exception:", error);
  if (server) {
    server.close(() => {
      log.info("HTTP server closed due to uncaught exception");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  log.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (server) {
    server.close(() => {
      log.info("HTTP server closed due to unhandled promise rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
