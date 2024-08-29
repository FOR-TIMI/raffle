import config from "config";
import mongoose from "mongoose";
import log from "../Logger";

async function connectDB() {
  try {
    console.log( config.get<string>("dbUri"))
    const dbUri: string = config.get<string>("dbUri");
    await mongoose.connect(dbUri);
    log.info(" Connected to MongoDB  ");
  } catch (error) {
    log.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

export default connectDB;
