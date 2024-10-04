import { Express, NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  code?: string;
}

export const csrfMiddleware = (app: Express): Express => {
  app.use(
    (err: CustomError, req: Request, res: Response, next: NextFunction) => {
      if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
          status: "error",
          message: "Invalid CSRF token",
        });
      }
      next(err);
    }
  );

  return app;
};
