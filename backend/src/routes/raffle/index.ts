import express from "express";
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
} from "../../controller/raffle";

import isRaffleCreator from "../../middleware/raffleAuthor";
import requireUser from "../../middleware/requireUser";
import validateResource from "../../middleware/validate";

import { conditionalValidateResourceIfSignedIn } from "../../middleware/conditionalValidateSignedIn";
import {
  createRaffleSchema,
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
} from "../../schemas/raffle";

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
  buildEndpoint(":raffleId/participants/:participantEmail"),
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

export default router;
