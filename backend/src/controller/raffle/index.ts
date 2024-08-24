import config from "config";
import { Request, Response } from "express";
import QRCode from "qrcode";

import RaffleModel from "../../model/raffle";
import UserModel from "../../model/user";

import {
  CreateRaffleRequest,
  JoinRaffleRequestParams,
  RemoveParticipantFromRaffleParams,
  SpinRaffleParams,
} from "../../schemas/raffle";

import MailService from "../../service/mail";
import { getUserRaffle } from "../../service/raffle";
import { findUserById } from "../../service/user";
import { shuffleArray } from "../../utils/helpers";

export async function createRaffleHandler(
  req: Request<{}, {}, CreateRaffleRequest["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const user = await findUserById(userId);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const raffle = await RaffleModel.create({
    title: req.body.title,
    creator: user._id,
    noOfpossibleWinners: req.body.noOfpossibleWinners,
  });

  user.createdRaffles.push(raffle._id);
  await user.save();

  const uiBaseUrl = config.get<string>("uiBaseUrl");
  const qrCodeDataUrl = await QRCode.toDataURL(
    `${uiBaseUrl}/raffle/${raffle._id}`
  );

  return res.send({ raffle, qrCode: qrCodeDataUrl });
}

export async function joinRaffleHandler(
  req: Request<JoinRaffleRequestParams>,
  res: Response
) {
  const { raffleId } = req.params;
  const userId = res.locals.user._id;

  const raffle = await RaffleModel.findById(raffleId);

  if (!raffle) {
    return res.status(404).json({ message: "Raffle not found" });
  }

  if (raffle.participants.includes(userId)) {
    return res.status(400).json({ message: "User already joined the raffle" });
  }

  // Add the participant's reference to the raffle's participants array
  raffle.participants.push(userId);

  const user = await findUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Add the raffle reference to the user's joinedRaffles array
  user.joinedRaffles.push(raffle._id);

  await raffle.save();
  await user.save();

  return res.send(raffle);
}

export async function spinRaffleHandler(
  req: Request<SpinRaffleParams>,
  res: Response
) {
  const { raffleId } = req.params;
  const raffle = await RaffleModel.findById(raffleId).populate("participants");

  if (!raffle) {
    return res.status(404).send("Raffle not found");
  }

  if (String(raffle.creator) !== String(res.locals.user._id)) {
    return res.status(403).send("Only the creator can spin the raffle");
  }

  if (raffle.winners.length > 0) {
    return res.status(400).send("Raffle has already been spun");
  }

  const winners = shuffleArray(raffle.participants).slice(
    0,
    raffle.noOfpossibleWinners
  );
  raffle.winners = winners;

  await raffle.save();

  for (const winner of winners) {
    await MailService.sendEmail({
      from: "timicancode@gmail.com",
      to: winner.email,
      subject: "You Won the Raffle!",
      text: `Congratulations ${winner.name}, you won the raffle ${raffle.title}!`,
    });
  }

  return res.status(200).json(raffle);
}

export async function getRaffleDetailsHandler(
  req: Request<JoinRaffleRequestParams>,
  res: Response
) {
  const { raffleId } = req.params;
  const raffle = await RaffleModel.findById(raffleId)
    .populate("participants")
    .populate("winners");

  if (!raffle) {
    return res.status(404).send("Raffle not found");
  }

  return res.status(200).json(raffle);
}

export async function getUserRafflesHandler(req: Request, res: Response) {
  const user = res.locals.user;
  const raffles = await getUserRaffle(user._id);
  return res.send(raffles);
}

export async function deleteRaffleHandler(
  req: Request<JoinRaffleRequestParams>,
  res: Response
) {
  const raffleId = req.params.raffleId;

  try {
    // Find the raffle
    const raffle = await RaffleModel.findById(raffleId);

    if (!raffle) {
      return res.status(404).send("Raffle not found");
    }

    // Update all users who have this raffle in their joinedRaffles
    await UserModel.updateMany(
      { joinedRaffles: raffleId },
      { $pull: { joinedRaffles: raffleId } }
    );

    // Delete the raffle
    await RaffleModel.findByIdAndDelete(raffleId);

    // Update the creator's createdRaffles array
    await UserModel.findByIdAndUpdate(res.locals.user._id, {
      $pull: { createdRaffles: raffleId },
    });

    res.status(200).send("Raffle deleted successfully");
  } catch (error) {
    console.error("Error deleting raffle:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function removeParticipantFromRaffleHandler(
  req: Request<RemoveParticipantFromRaffleParams>,
  res: Response
) {
  const raffleId = req.params.raffleId;
  const participantId = req.params.participantId;

  try {
    // Find the raffle
    const raffle = await RaffleModel.findById(raffleId);

    if (!raffle) {
      return res.status(404).send("Raffle not found");
    }

    // Check if the participant is in the raffle
    const isParticipant = raffle.participants.some(
      (p) => p.toString() === participantId
    );

    if (!isParticipant) {
      return res.status(400).send("User is not a participant in this raffle");
    }

    // Remove participant from the raffle
    await RaffleModel.findByIdAndUpdate(raffleId, {
      $pull: { participants: participantId },
    });

    // Remove raffle from the user's joinedRaffles
    await UserModel.findByIdAndUpdate(participantId, {
      $pull: { joinedRaffles: raffleId },
    });

    res.status(200).send("Participant removed from raffle successfully");
  } catch (error) {
    console.error("Error removing participant from raffle:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getUserJoinedRafflesHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;

    const joinedRaffles = await RaffleModel.find({
      participants: userId,
    }).select("title creator noOfpossibleWinners");

    if (!joinedRaffles.length) {
      return res
        .status(200)
        .json({ message: "User has not joined any raffles", raffles: [] });
    }

    const raffleData = joinedRaffles.map((raffle) => ({
      _id: raffle._id,
      title: raffle.title,
      creator: raffle.creator,
      winners: raffle.winners,
    }));

    res.status(200).json({ raffles: raffleData });
  } catch (error) {
    console.error("Error fetching user's joined raffles:", error);
    res.status(500).send("Internal Server Error");
  }
}
