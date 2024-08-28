import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../../../components/common/Alert";
import TextField from "../../../components/common/TextField";
import { PAGE_ROUTES } from "../../../config/constants";
import { openAlertWithAutoClose } from "../../../features/alert/alertThunk";
import { createRaffleThunk } from "../../../features/raffle/raffleThunk";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { RaffleCreateParams } from "../../../types";
import { initialValues, schema } from "./config";

const CreateRaffleForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = async (
    values: RaffleCreateParams,
    { resetForm, setSubmitting }: FormikHelpers<RaffleCreateParams>
  ) => {
    try {
      await dispatch(createRaffleThunk(values)).unwrap();
      dispatch(openAlertWithAutoClose("Raffle created", "success", 8000));
      navigate(PAGE_ROUTES.HOME);
    } catch (err) {
      dispatch(
        openAlertWithAutoClose(
          err.message || "An error occurred while creating the raffle",
          "error",
          3000
        )
      );
      console.error(err);
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  return (
    <>
      <TransitionAlerts />
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                maxWidth: "600px",
                margin: "10px 0",
              }}
            >
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    name="title"
                    type="text"
                    errors={errors}
                    touched={touched}
                    labelText="Raffle Name"
                    sx={{ margin: 0 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="filled"
                    sx={{ minWidth: 120, width: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-filled-label">
                      Max Number of Possible Winners
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      name="noOfPossibleWinners"
                      value={values.noOfPossibleWinners}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <MenuItem key={i} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box margin="1rem 0">
                <Button
                  fullWidth
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                  sx={{
                    p: "0.8rem",
                    height: "50px",
                    backgroundColor: "#174B30",
                    color: "#D0EAC3",
                    "&:hover": { color: "#fff" },
                    maxWidth: "130px",
                    textTransform: "none",
                    opacity: !isValid || !dirty || isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      sx={{
                        color: "#0D453C",
                      }}
                      size={22}
                    />
                  ) : (
                    <Typography color="#D0EAC3">Create Raffle</Typography>
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateRaffleForm;
