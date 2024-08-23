import config from "config";
import {
  Strategy as GoogleStrategy,
  StrategyOptions,
} from "passport-google-oauth2";
import { thirdPartyAuth } from "../../../service/auth/third-party";

const googleAuthConfig = config.get<StrategyOptions>("googleAuthConfig");

export default new GoogleStrategy(
  googleAuthConfig,
  thirdPartyAuth({ provider: "google" })
);
