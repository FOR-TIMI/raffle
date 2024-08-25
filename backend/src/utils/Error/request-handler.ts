import { ErrorRequestHandler } from "express";
import log from "../Logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  log.error(err.stack);
  res.status(500).send("Something went wrong");
};
