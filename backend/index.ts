import cors from "cors";
import express, { Express, Request, Response } from "express";
import log from "./src/utils/Logger";

const port: number = 8000;

const app: Express = express();

app.use(cors());
app.use(
  express.json({
    limit: "10kb",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
