import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import crypto from "crypto";
import log from "../../utils/Logger";
import { Raffle } from "../raffle";

export const privateFields = [
  "password",
  "verificationCode",
  "passwordResetCode",
  "__v",
  "verifiedEmail",
];

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hash = await argon2.hash(this.password);
  this.password = hash;

  next();
})
@index({ email: 1, verificationCodeExpires: 1 }, { expireAfterSeconds: 0 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        privateFields.forEach((field) => {
          delete ret[field];
          return ret;
        });
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ default: () => crypto.randomBytes(32).toString("hex") })
  verificationCode: string | undefined;

  @prop({ default: new Date(Date.now() + 3600 * 1000) })
  verificationCodeExpires: Date | undefined;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verifiedEmail: boolean;

  @prop({ ref: () => Raffle })
  createdRaffles: Ref<Raffle>[];

  @prop({ ref: () => Raffle })
  joinedRaffles: Ref<Raffle>[];

  async verifyPassword(
    this: DocumentType<User>,
    suppliedPassword: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(this.password, suppliedPassword);
    } catch (error) {
      log.error(error, "Could'nt verify password");
      return false;
    }
  }
}

export const UserModel = getModelForClass(User);
export { User };
export default UserModel;
