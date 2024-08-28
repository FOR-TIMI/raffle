import createDOMPurify from "dompurify";
import { NextFunction, Request, Response } from "express";
import { JSDOM } from "jsdom";
import { ParsedQs } from "qs";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

interface SanitizeOptions {
  maxDepth?: number;
  excludeFields?: string[];
  additionalContentTypes?: string[];
  logSanitizedFields?: boolean;
}

type SanitizeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SanitizeValue[]
  | { [key: string]: SanitizeValue };

const purify = (options: SanitizeOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const MAX_DEPTH = options.maxDepth || 10;
    const sanitizedFields = new Set<string>();

    const sanitizeValue = (value: SanitizeValue, depth = 0): SanitizeValue => {
      if (depth > MAX_DEPTH) return value;

      try {
        if (typeof value === "string") {
          const sanitized = DOMPurify.sanitize(value.trim());
          if (sanitized !== value) sanitizedFields.add(value);
          return sanitized;
        }
        if (Array.isArray(value)) {
          return value.map((item) => sanitizeValue(item, depth + 1));
        }
        if (typeof value === "object" && value !== null) {
          return sanitizeObject(value, depth + 1);
        }
      } catch (error) {
        console.error("Sanitization error:", error);
      }
      return value;
    };

    const sanitizeObject = <T extends object>(obj: T, depth = 0): T => {
      const sanitized: Partial<T> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (
          key.toLowerCase().includes("password") ||
          options.excludeFields?.includes(key)
        ) {
          sanitized[key as keyof T] = value as T[keyof T];
        } else {
          sanitized[key as keyof T] = sanitizeValue(
            value as SanitizeValue,
            depth
          ) as T[keyof T];
        }
      }
      return sanitized as T;
    };

    const allowedContentTypes = [
      "application/json",
      "application/x-www-form-urlencoded",
      ...(options.additionalContentTypes || []),
    ];

    if (allowedContentTypes.some((type) => req.is(type))) {
      req.query = sanitizeObject<ParsedQs>(req.query);
      req.params = sanitizeObject(req.params);
      if (req.body) {
        req.body = sanitizeObject(req.body);
      }
    }

    if (options.logSanitizedFields && sanitizedFields.size > 0) {
      console.log("Sanitized fields:", Array.from(sanitizedFields));
    }

    next();
  };
};

export default purify;
