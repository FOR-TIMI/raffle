require("dotenv").config();
process.env.ALLOW_CONFIG_MUTATIONS = "true";

import config from "config";
import express from "express";
import deserializeUser from "./middleware/deserialize";
import router from "./routes";
import connectDB from "./utils/Db";
import log from "./utils/Logger";

const app = express();
const port = config.get<number>("port");
const baseRoute = config.get<string>("baseRoute");

app.use(express.json());

app.use(deserializeUser);
app.use(baseRoute, router);

app.listen(port, () => {
  log.info(`App is running on port ${port}`);

  connectDB();
});
