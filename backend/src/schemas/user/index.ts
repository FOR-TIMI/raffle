import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: "First name is required" }),
    lastName: string({ required_error: "Last name is required" }),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password should have at least 6 characters"
    ),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("invalid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password should have at least 6 characters"
    ),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserRequest = TypeOf<typeof createUserSchema>["body"];
export type VerifyUserRequest = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotPasswordRequest = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordRequest = TypeOf<typeof resetPasswordSchema>;
