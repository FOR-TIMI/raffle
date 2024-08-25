import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Raffle } from ".";

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class RaffleParticipant {
  @prop({ required: true, ref: "Raffle" })
  raffle!: Ref<Raffle>;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ default: false })
  isWinner: boolean;
}

const RaffleParticipantModel = getModelForClass(RaffleParticipant);
export default RaffleParticipantModel;
