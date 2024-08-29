import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Raffle {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  creatorEmail: string;

  @prop({ required: true })
  noOfPossibleWinners: number;

  @prop({ default: 0 })
  participantCount: number;

  @prop({ default: 0 })
  winnerCount: number;

  @prop({ required: true })
  qrCode: string;
}

const RaffleModel = getModelForClass(Raffle);

export default RaffleModel;
