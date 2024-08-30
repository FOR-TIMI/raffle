import * as yup from "yup";
import { User } from "../../../types";

const initialValues: User = {
  firstName: "",
  lastName: "",
  email: "",
};

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must not exceed 50 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name must not exceed 50 characters"),
  email: yup.string().required("Email is required").email("Invalid Email"),
});

export { initialValues, schema };
