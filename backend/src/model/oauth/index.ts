import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "../user";

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class OAuth {
  @prop({ required: true })
  public provider!: string;

  @prop({ required: true, unique: true })
  public providerId!: string;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;
}

const OAuthModel = getModelForClass(OAuth);

export default OAuthModel;
