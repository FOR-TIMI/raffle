import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";

import { User } from "../user";

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Raffle {
  @prop({ required: true })
  title: string;

  @prop({ required: true, ref: "User" })
  creator!: Ref<User>;

  @prop({ required: true })
  noOfpossibleWinners: number;

  @prop({
    ref: "User",
    type: () => [User],
    uniqueItems: true,
  })
  participants: Ref<User>[];

  @prop({
    ref: "User",
    type: () => [User],
    uniqueItems: true,
  })
  winners: Ref<User>[];
}
const RaffleModel = getModelForClass(Raffle);
export default RaffleModel;
