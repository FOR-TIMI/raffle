import express, { Request, Response } from "express";
import {
  createRaffleHandler,
  deleteRaffleHandler,
  getParticipantsHandler,
  getRaffleDetailsHandler,
  getUserJoinedRafflesHandler,
  getUserRafflesHandler,
  getWinnersHandler,
  joinRaffleHandler,
  removeParticipantFromRaffleHandler,
  resetRaffleHandler,
  spinRaffleHandler,
  uploadParticipantsFileHandler,
} from "../../controller/raffle";

import isRaffleCreator from "../../middleware/raffleAuthor";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";

import { conditionalValidateResourceIfSignedIn } from "../../middleware/conditionalValidateSignedIn";
import {
  createRaffleSchema,
  CustomFile,
  GetParticipantsParams,
  GetParticipantsQuery,
  getParticipantsSchema,
  getRaffleDetailsSchema,
  getWinnersSchema,
  joinRaffleSchema,
  removeParticipantFromRaffleSchema,
  ResetRaffleParams,
  resetRaffleSchema,
  spinRaffleSchema,
  UploadParticipantsRequest,
  uploadParticipantsSchema,
} from "../../schemas/raffle";
import { isCustomFile } from "../../service/raffle";
import upload from "../../utils/Multer";

const router = express.Router();
const baseEndpoint = "/raffles";

const buildEndpoint = (path: string) => `${baseEndpoint}/${path}`;

/** Get all raffles created by the current user */
router.get(baseEndpoint, requireUser, getUserRafflesHandler);

/** Create new raffle */
router.post(
  baseEndpoint,
  validateResource(createRaffleSchema),
  createRaffleHandler
);

/** Add new participant */
router.post(
  buildEndpoint(":raffleId/join"),
  conditionalValidateResourceIfSignedIn(joinRaffleSchema),
  joinRaffleHandler
);

/** Get all user joined raffles */
router.get(buildEndpoint("joined"), requireUser, getUserJoinedRafflesHandler);

/** Get raffle details */
router.get(
  buildEndpoint(":raffleId"),
  validateResource(getRaffleDetailsSchema),
  getRaffleDetailsHandler
);

/** Delete raffle */
router.delete(
  buildEndpoint(":raffleId"),
  requireUser,
  isRaffleCreator,
  deleteRaffleHandler
);

/** Remove Participant from raffle */
router.delete(
  buildEndpoint(":raffleId/participants/:participantId"),
  requireUser,
  isRaffleCreator,
  validateResource(removeParticipantFromRaffleSchema),
  removeParticipantFromRaffleHandler
);

/** Spin Raffle */
router.get(
  buildEndpoint(":raffleId/spin"),
  requireUser,
  isRaffleCreator,
  validateResource(spinRaffleSchema),
  spinRaffleHandler
);

/** Get participants */
router.get<GetParticipantsParams, {}, {}, GetParticipantsQuery>(
  buildEndpoint(":raffleId/participants"),
  validateResource(getParticipantsSchema),
  getParticipantsHandler
);

/* Get winners */
router.get(
  buildEndpoint(":raffleId/winners"),
  validateResource(getWinnersSchema),
  getWinnersHandler
);

/** Reset Raffle */
router.get<ResetRaffleParams>(
  buildEndpoint(":raffleId/reset"),
  requireUser,
  isRaffleCreator,
  validateResource(resetRaffleSchema),
  resetRaffleHandler
);

/** Upload Raffle participants file */
router.post(
  buildEndpoint(":raffleId/participants/upload"),
  requireUser,
  isRaffleCreator,
  upload.single("file"),
  validateResource(uploadParticipantsSchema),
  async (req: Request, res: Response) => {
    // Type assertion to CustomFile
    const file = req.file as CustomFile | undefined;

    if (!isCustomFile(file)) {
      return res.status(400).json({ message: "Invalid file type." });
    }

    // Call your handler function
    return uploadParticipantsFileHandler(req as UploadParticipantsRequest, res);
  }
);
export default router;
