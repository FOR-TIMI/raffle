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

const checkEmailAvailability = debounce(
  async (email: string): Promise<boolean> => {
    if (availabilityCache[email] !== undefined) {
      return !availabilityCache[email];
    }

    try {
      await axios.post(USER_API_ROUTES.CHECK_EMAIL_AVAILABILITY, { email });
      availabilityCache[email] = true;
      return false;
    } catch (error) {
      if (error.response?.status === 404) {
        availabilityCache[email] = false;
        return true;
      }
      console.error("Error checking email availability:", error);
      return false;
    }
  },
  550
);

export { initialValues, schema, signUpApi };
