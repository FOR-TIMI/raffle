import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import log from "../../utils/Logger";

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
@index({ email: 1 })
@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verifiedEmail: boolean;

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

const UserModel = getModelForClass(User);

export default UserModel;
