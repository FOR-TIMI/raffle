export const PAGE_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/users/resetPassword",
  CHECK_EMAIL_AVAILABILITY: "/users/checkemail",
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
};
