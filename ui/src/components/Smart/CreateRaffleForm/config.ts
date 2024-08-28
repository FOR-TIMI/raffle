import * as yup from "yup";
import { RaffleCreateParams } from "../../../types";

const initialValues: RaffleCreateParams = {
  title: "",
  noOfPossibleWinners: 1,
};

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Raffle Name is required")
    .min(2, "Raffle Name must be at least 2 characters")
    .max(50, "Raffle Name must not exceed 50 characters"),
  noOfPossibleWinners: yup
    .number()
    .min(1)
    .required("No of Possible Winners is required"),
});

export { initialValues, schema };
