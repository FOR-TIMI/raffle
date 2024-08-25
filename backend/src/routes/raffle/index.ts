import express from "express";

import {
  createRaffleHandler,
  deleteRaffleHandler,
  getRaffleDetailsHandler,
  getUserJoinedRafflesHandler,
  getUserRafflesHandler,
  joinRaffleHandler,
  removeParticipantFromRaffleHandler,
  spinRaffleHandler,
} from "../../controller/raffle";

import isRaffleCreator from "../../middleware/raffleAuthor";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";

import {
  createRaffleSchema,
  getRaffleDetailsSchema,
  spinRaffleSchema,
} from "../../schemas/raffle";

const router = express.Router();
const baseEndpoint = "/raffles";

const buildEndpoint = (path: string) => `${baseEndpoint}/${path}`;

/** Get all raffles created by the current user */
router.get(baseEndpoint, requireUser, getUserRafflesHandler);

/** Create new raffle */
router.post(
  baseEndpoint,
  requireUser,
  validateResource(createRaffleSchema),
  createRaffleHandler
);

/** Add new participant */
router.get(buildEndpoint(":raffleId/join"), requireUser, joinRaffleHandler);

/** Get all user joined raffles */
router.get(buildEndpoint("joined"), requireUser, getUserJoinedRafflesHandler);

/** Allow only creator and participants to get access to raffles/raffleId */
/** Get raffle details */
router.get(
  buildEndpoint(":raffleId"),
  requireUser,
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

export default router;
