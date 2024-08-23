import { nanoid } from "nanoid";
import { Profile } from "passport";
import { VerifyCallback } from "passport-google-oauth2";
import OAuthModel from "../../model/oauth";
import UserModel from "../../model/user";
import log from "../../utils/Logger";

type ThirdPartyAuthConfig = {
  provider: "google" | "apple" | "facebook";
};

export const thirdPartyAuth =
  ({ provider }: ThirdPartyAuthConfig) =>
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const email = profile.emails?.[0].value;

      // Check if OAuth entry exists for this provider ID
      let oauthEntry = await OAuthModel.findOne({
        provider,
        providerId: profile.id,
      });

      if (!oauthEntry) {
        // If not, check if a user with the same email exists
        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            password: nanoid(), // Placeholder password
            verifiedEmail: true,
          });
        }

        oauthEntry = await OAuthModel.create({
          provider,
          providerId: profile.id,
          userId: user._id,
        });
      }

      const user = await UserModel.findById(oauthEntry.userId);

      if (!user) {
        log.error("User not found for OAuth entry", oauthEntry);
        return done(null, undefined);
      }

      return done(null, user);
    } catch (err) {
      log.error(`Error authenticating with ${provider}`, err);
      return done(err, undefined);
    }
  };
