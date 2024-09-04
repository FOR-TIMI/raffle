export const PAGE_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/users/resetPassword",
  CHECK_EMAIL_AVAILABILITY: "/users/checkemail",
  ONE_DRAW: "/draws/:id",
  CREATE_RAFFLE: "create",
  ADD_PARTICIPANT: "add-participant",
  DRAWS: "/draws",
};

export const USER_API_ROUTES = {
  LOGIN: "/sessions",
  SIGNUP: "/users",
  FORGOT_PASSWORD: "/users/forgotpassword",
  RESET_PASSWORD: "/users/resetpassword/:id/:passwordResetCode",
  CHECK_EMAIL_AVAILABILITY: "/users/checkemail",
  VERIFY_EMAIL: "/users/verify/:id/:verificationCode",
  REFRESH_TOKEN: "/sessions/refresh",
  GET_USER: "/users/me",
  LOG_OUT: "/sessions/end",
};

export const RAFFLES_API_ROUTES = {
  GET_USER_RAFFLES: "/raffles",
  CREATE_RAFFLE: "/raffles",
  ADD_PARTICIPANT: "/raffles/:raffleId/join",
  GET_USER_JOINED_RAFFLES: "/raffles/joined",
  GET_RAFFLE_DETAILS: "/raffles/:raffleId",
  DELETE_RAFFLE: "/raffles/:raffleId",
  REMOVE_RAFFLE_PARTICIPANT: "/raffles/:raffleId/participants/:participantId",
  SPIN_RAFFLE: "/raffles/:raffleId/spin",
  GET_RAFFLE_PARTICIPANTS: "/raffles/:raffleId/participants",
  GET_RAFFLE_WINNERS: "/raffles/:raffleId/winners",
  RESET_RAFFLE: "/raffles/:raffleId/reset",
  UPLOAD_PARTICIPANTS: "/raffles/:raffleId/participants/upload",
};
