import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../../../components/common/Alert";
import TextField from "../../../components/common/TextField";
import { PAGE_ROUTES } from "../../../config/constants";
import { RootState } from "../../../config/store";
import { openAlertWithAutoClose } from "../../../features/alert/alertThunk";
import { addParticipantToCurrentRaffle } from "../../../features/raffle/raffleSlice";
import { addParticipantThunk } from "../../../features/raffle/raffleThunk";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { User } from "../../../types";
import { initialValues, schema } from "./config";

const AddParticipantForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state: RootState) => state.raffle.currentRaffle);
  const axios = useAxiosPrivate();

  const handleFormSubmit = async (
    values: User,
    { resetForm, setSubmitting }: FormikHelpers<User>
  ) => {
    try {
      const payload = { participant: values, raffleId: _id };
      await dispatch(addParticipantThunk({ axios, ...payload })).unwrap();
      dispatch(addParticipantToCurrentRaffle(values));
      dispatch(openAlertWithAutoClose("Participant Added", "success", 1000));

      setTimeout(() => {
        navigate(PAGE_ROUTES.ONE_DRAW.replace(":id", _id));
      }, 0);
    } catch (err) {
      dispatch(
        openAlertWithAutoClose(
          err.message || "Couldn't add participant",
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    type="text"
                    errors={errors}
                    touched={touched}
                    labelText="First Name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    type="text"
                    errors={errors}
                    touched={touched}
                    labelText="LastName"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    type="text"
                    errors={errors}
                    touched={touched}
                    labelText="Email"
                  />
                </Grid>
              </Grid>

              <Box margin="1rem 0">
                <Button
                  fullWidth
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                  sx={{
                    p: "0.8rem",
                    maxWidth: "200px",
                    marginBottom: "1rem",
                    height: "50px",
                    backgroundColor: "#174B30",
                    color: "#D0EAC3",
                    "&:hover": { color: "#fff" },
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
                    <Typography color="#D0EAC3">Add Participant</Typography>
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

export default AddParticipantForm;
