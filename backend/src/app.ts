require("dotenv").config();

import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Server } from "http";
import path from "path";
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

app.use(express.static("public"));

// Security middleware
const helmetConfig = config.get<object>("helmetConfig");
app.use(helmet(helmetConfig));

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// CORS configuration
const corsOptions = config.get<object>("corsConfig");
app.use(cors(corsOptions));

// CSRF protection
// app.use(csurf({ cookie: true }));
// csrfMiddleware(app);

// Rate limiting
const rateLimitConfig = config.get<object>("rateLimitConfig");
const limiter = rateLimit(rateLimitConfig);
// app.use(limiter);

// Custom middleware
app.use(sanitizerMongo());
app.use(purify());
app.use(deserializeUser);

// Routes
app.use(baseRoute, router);

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  if (req.path.toLowerCase().startsWith(baseRoute)) {
    res.status(404).json({ message: "API route not found" });
  } else {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  }
});

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
