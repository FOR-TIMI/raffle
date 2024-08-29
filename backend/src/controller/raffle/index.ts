import config from "config";
import { Request, Response } from "express";
import QRCode from "qrcode";

import RaffleModel, { Raffle } from "../../model/raffle";

import {
  CreateRaffleRequest,
  GetParticipantsParams,
  GetParticipantsQuery,
  GetRaffleDetailsParams,
  GetWinnersParams,
  JoinRaffleRequestBody,
  JoinRaffleRequestParams,
  RemoveParticipantFromRaffleParams,
  ResetRaffleParams,
  SpinRaffleParams,
} from "../../schemas/raffle";

import mongoose from "mongoose";
import RaffleParticipantModel from "../../model/raffle/participant";
import MailService from "../../service/mail";
import { getOneRaffle } from "../../service/raffle";
import { shuffleArray } from "../../utils/helpers";

export async function createRaffleHandler(
  req: Request<{}, {}, CreateRaffleRequest["body"]>,
  res: Response
) {
  const { title, noOfPossibleWinners } = req.body;
  const signedInUser = res.locals.user;

  if (!signedInUser) {
    return res
      .status(401)
      .json({ message: "You must be signed in to create a raffle" });
  }

  try {
    const uiBaseUrl = config.get<string>("uiBaseUrl");

    // Create a temporary ID for the QR code
    const tempId = new mongoose.Types.ObjectId();

    const qrCodeDataUrl = await QRCode.toDataURL(
      `${uiBaseUrl}/raffle/${tempId}`
    );

    const raffleData = {
      title: title.trim(),
      noOfPossibleWinners,
      creatorEmail: signedInUser.email,
      qrCode: qrCodeDataUrl,
    };

    const raffle = await RaffleModel.create(raffleData);

    // Update the QR code with the actual raffle ID
    const updatedQrCodeDataUrl = await QRCode.toDataURL(
      `${uiBaseUrl}/raffle/${raffle._id}`
    );

    raffle.qrCode = updatedQrCodeDataUrl;
    await raffle.save();

    return res.status(201).json({ raffle });
  } catch (error: any) {
    console.error("Error creating raffle:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinRaffleHandler(
  req: Request<JoinRaffleRequestParams, {}, JoinRaffleRequestBody>,
  res: Response
) {
  const { raffleId } = req.params;
  const participantData = {
    email: req.body.email.trim(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
  };
  try {
    if (!raffleId)
      return res.status(400).json({ message: "Raffle ID is required" });

    const raffle = await RaffleModel.findOne({ _id: raffleId });
    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }

    const existingParticipant = await RaffleParticipantModel.findOne({
      raffle: raffle._id,
      email: participantData.email,
    });

    if (existingParticipant) {
      return res
        .status(400)
        .json({ message: "User already joined the raffle" });
    }

    const newParticipant = new RaffleParticipantModel({
      raffle: raffleId,
      ...participantData,
    });

    await Promise.all([
      newParticipant.save(),
      RaffleModel.findByIdAndUpdate(raffleId, {
        $inc: { participantCount: 1 },
      }),
    ]);

    return res.status(200).json({ message: "Successfully joined the raffle" });
  } catch (error) {
    console.error("Error joining raffle:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function spinRaffleHandler(
  req: Request<SpinRaffleParams>,
  res: Response
) {
  const { raffleId } = req.params;
  const raffle = await RaffleModel.findById(raffleId);

  if (!raffle) {
    return res.status(404).send("Raffle not found");
  }

  if (raffle.creatorEmail !== res.locals.user.email) {
    return res.status(403).send("Only the creator can spin the raffle");
  }

  if (raffle.winnerCount > 0) {
    return res.status(400).send("Raffle has already been spun");
  }

  // Get all participants
  const participants = await RaffleParticipantModel.find({
    raffle: raffleId,
  });

  if (participants.length === 0) {
    return res.status(400).send("No participants in the raffle");
  }

  // Randomly select winners
  const shuffledParticipants = shuffleArray(participants);
  const winners = shuffledParticipants.slice(0, raffle.noOfPossibleWinners);

  // Update winners in the database
  await RaffleParticipantModel.updateMany(
    { _id: { $in: winners.map((w) => w._id) } },
    { $set: { isWinner: true } }
  );

  // Update raffle with winner count
  raffle.winnerCount = winners.length;
  await raffle.save();

  // Send emails to winners
  for (const winner of winners) {
    await MailService.sendEmail({
      from: "sds@gmail.com",
      to: winner.email,
      subject: "You Won the Raffle!",
      text: `Congratulations ${winner.firstName} ${winner.lastName}, you won the raffle ${raffle.title}!`,
    });
  }

  // Fetch updated raffle data
  const updatedRaffle = await RaffleModel.findById(raffleId);
  const updatedWinners = await RaffleParticipantModel.find({
    raffle: raffleId,
    isWinner: true,
  });

  return res.status(200).json({
    raffle: updatedRaffle,
    winners: updatedWinners.map((w) => ({
      email: w.email,
      firstName: w.firstName,
      lastName: w.lastName,
    })),
  });
}

export async function getRaffleDetailsHandler(
  req: Request<GetRaffleDetailsParams>,
  res: Response
) {
  const { raffleId } = req.params;
  try {
    const raffle = await RaffleModel.findById(raffleId).lean();

    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }

    const participants = await RaffleParticipantModel.find({
      raffle: raffleId,
    }).lean();

    const raffleDetails = {
      ...raffle,
      participants: participants.map((p) => ({
        id: p._id.toString(),
        email: p.email,
        firstName: p.firstName,
        lastName: p.lastName,
        isWinner: p.isWinner,
      })),
    };

    return res.status(200).json(raffleDetails);
  } catch (error) {
    console.error("Error fetching raffle details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserRafflesHandler(req: Request, res: Response) {
  try {
    const userEmail = res.locals.user.email;
    const raffles = await getOneRaffle(userEmail);
    return res.status(200).json(raffles);
  } catch (error) {
    console.error("Error fetching user's raffles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteRaffleHandler(
  req: Request<{ raffleId: string }>,
  res: Response
) {
  const raffleId = req.params.raffleId;

  try {
    const raffle = await RaffleModel.findById(raffleId);

    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }

    if (raffle.creatorEmail !== res.locals.user.email) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this raffle" });
    }

    await RaffleParticipantModel.deleteMany({ raffle: raffleId });
    await RaffleModel.findByIdAndDelete(raffleId);

    res.status(200).json({
      message: "Raffle and all associated entries deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting raffle:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeParticipantFromRaffleHandler(
  req: Request<RemoveParticipantFromRaffleParams>,
  res: Response
) {
  const { raffleId, participantId } = req.params;

  try {
    const raffle = await RaffleModel.findById(raffleId);

    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }

    if (raffle.creatorEmail !== res.locals.user.email) {
      return res.status(403).json({
        message:
          "You are not authorized to remove participants from this raffle",
      });
    }

    const result = await RaffleParticipantModel.findOneAndDelete({
      _id: participantId,
      raffle: raffleId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Participant not found in this raffle" });
    }

    await RaffleModel.findByIdAndUpdate(raffleId, {
      $inc: { participantCount: -1 },
    });

    res
      .status(200)
      .json({ message: "Participant removed from raffle successfully" });
  } catch (error) {
    console.error("Error removing participant from raffle:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserJoinedRafflesHandler(req: Request, res: Response) {
  try {
    const userEmail = res.locals.user.email;

    const joinedRaffles = await RaffleParticipantModel.find({
      email: userEmail,
      isWinner: false,
    })
      .populate<{ raffle: Raffle }>(
        "raffle",
        "title creatorEmail noOfPossibleWinners winnerCount"
      )
      .lean();

    if (!joinedRaffles.length) {
      return res
        .status(200)
        .json({ message: "User has not joined any raffles", raffles: [] });
    }

    const raffleData = joinedRaffles.map(({ raffle }) => ({
      _id: (raffle as any)._id,
      title: raffle.title,
      creator: raffle.creatorEmail,
      noOfPossibleWinners: raffle.noOfPossibleWinners,
      winnerCount: raffle.winnerCount,
    }));

    res.status(200).json({ raffles: raffleData });
  } catch (error) {
    console.error("Error fetching user's joined raffles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getParticipantsHandler(
  req: Request<GetParticipantsParams, {}, {}, GetParticipantsQuery>,
  res: Response
) {
  const { raffleId } = req.params;
  const { page, limit } = req.query;

  try {
    const parsedPage = parseInt(page || "0") || 1;
    const parsedLimit = parseInt(limit || "0") || 10;

    const skip = (parsedPage - 1) * parsedLimit;

    const participants = await RaffleParticipantModel.find({ raffle: raffleId })
      .skip(skip)
      .limit(parsedLimit)
      .select("email firstName lastName isWinner")
      .lean();

    const totalParticipants = await RaffleParticipantModel.countDocuments({
      raffle: raffleId,
    });

    return res.status(200).json({
      participants,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalParticipants / parsedLimit),
      totalParticipants,
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getWinnersHandler(
  req: Request<GetWinnersParams>,
  res: Response
) {
  const raffleId = req.params.raffleId;

  try {
    const winners = await RaffleParticipantModel.find({
      raffle: raffleId,
      isWinner: true,
    })
      .select("email firstName lastName")
      .lean();

    return res.status(200).json(winners);
  } catch (error) {
    console.error("Error fetching winners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function resetRaffleHandler(
  req: Request<ResetRaffleParams>,
  res: Response
) {
  const { raffleId } = req.params;
  const signedInUser = res.locals.user;

  try {
    const raffle = await RaffleModel.findById(raffleId);

    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }

    if (raffle.creatorEmail !== signedInUser.email) {
      return res
        .status(403)
        .json({ message: "Only the raffle creator can reset the raffle" });
    }

    if (raffle.winnerCount === 0) {
      return res.status(400).json({ message: "Raffle has not been spun yet" });
    }

    // Reset winner status for all participants
    await RaffleParticipantModel.updateMany(
      { raffle: raffleId },
      { $set: { isWinner: false } }
    );

    // Reset raffle winner count
    raffle.winnerCount = 0;
    await raffle.save();

    return res
      .status(200)
      .json({ message: "Raffle has been reset successfully" });
  } catch (error) {
    console.error("Error resetting raffle:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
