import { AxiosError } from "axios";
import { debounce } from "lodash";
import * as yup from "yup";
import axios from "../../../config/api";
import { USER_API_ROUTES } from "../../../config/constants";

export type RequestBody = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  passwordConfirmation: string;
};

const initialValues: RequestBody = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const availabilityCache: Record<string, boolean> = {};

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .test("checkEmail", "Email is already in use", async function (value = "") {
      if (!yup.string().email().isValidSync(value)) {
        return true;
      }
      return await checkEmailAvailability(value);
    }),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special character"
    )
    .required("Password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const signUpApi = async (body: RequestBody): Promise<any> => {
  const response = await axios.post(USER_API_ROUTES.SIGNUP, body);
  return response.data;
};

const checkEmailAvailability = async (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const debouncedCheck = debounce(async () => {
      if (availabilityCache[email] !== undefined) {
        resolve(availabilityCache[email]);
        return;
      }

      try {
        await axios.post(USER_API_ROUTES.CHECK_EMAIL_AVAILABILITY, { email });
        availabilityCache[email] = false; // Email is not available
        resolve(false);
      } catch (error) {
        if ((error as AxiosError).response?.status === 404) {
          availabilityCache[email] = true; // Email is available
          resolve(true);
        } else {
          console.error("Error checking email availability:", error);
          resolve(false);
        }
      }

      // Clear cache after some time to prevent memory leaks
      setTimeout(() => {
        delete availabilityCache[email];
      }, 5 * 60 * 1000); // Clear after 5 minutes
    }, 550);

    debouncedCheck();
  });
};

export { initialValues, schema, signUpApi };
