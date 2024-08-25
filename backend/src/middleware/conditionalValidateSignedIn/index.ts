import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import validateResource from "../validate";

export const conditionalValidateResourceIfSignedIn =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const signedInUser = res.locals.user;

    if (signedInUser) {
      try {
        schema.omit({ body: true }).parse({
          params: req.params,
          query: req.query,
        });
        next();
      } catch (e: any) {
        if (e instanceof ZodError) {
          return res.status(400).json(e.errors);
        }
        return res.status(400).json({ message: "Invalid request" });
      }
    } else {
      validateResource(schema)(req, res, next);
    }
  };
