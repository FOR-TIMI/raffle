import mongoSanitize, { Options } from "express-mongo-sanitize";

const sanitizerMongo = (options?: Options) => {
  return mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
    ...options,
  });
};

export default sanitizerMongo;
