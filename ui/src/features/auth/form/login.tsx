import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TransitionAlerts from "../../../components/common/Alert";
import TextField from "../../../components/common/TextField";
import TiLink from "../../../components/common/TiLink";
import { PAGE_ROUTES } from "../../../config/constants";
import { AppDispatch } from "../../../config/store";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { openAlertWithAutoClose } from "../../alert/alertThunk";
import { loginUser } from "../authThunk";
import { initialValues, validationSchema } from "./validation";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const axios = useAxiosPrivate();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await dispatch(loginUser({ ...values, axios })).unwrap();
          navigate(from, { replace: true });
        } catch (err) {
          dispatch(
            openAlertWithAutoClose(
              err.message || "Something Went wrong",
              "error",
              8000
            )
          );
        } finally {
          setSubmitting(false);
        }
      }}
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
          <TransitionAlerts />

          {/* Text Fields  */}
          <Box>
            <TextField
              type="text"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              errors={errors}
              touched={touched}
              labelText="Email Address"
            />

            <TextField
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              type="password"
              errors={errors}
              touched={touched}
              labelText="Password"
            />
          </Box>

          {/* Forgot Password  */}
          <Box margin="1rem 0" sx={{ float: "right" }}>
            <TiLink
              variant="link"
              to={PAGE_ROUTES.FORGOT_PASSWORD}
              text="Forgot Password?"
            />
          </Box>

          {/* Login Button */}
          <Box margin="1rem 0">
            <Button
              fullWidth
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              sx={{
                p: "0.8rem",
                height: "61.58px",
                backgroundColor: "#174B30",
                color: "#D0EAC3",
                "&:hover": {
                  color: "#fff",
                  cursor:
                    !isValid || !dirty || isSubmitting
                      ? "not-allowed"
                      : "pointer",
                },
                textTransform: "none",
                opacity: !isValid || !dirty || isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <CircularProgress
                  sx={{
                    color: "#fff",
                  }}
                  size={22}
                />
              ) : (
                <Typography color="#D0EAC3">Sign In</Typography>
              )}
            </Button>
          </Box>

          <Box
            margin="1rem 0 2rem 0"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="subtitle1">Don't have an account? </Typography>

            <TiLink
              sx={{ marginLeft: "5px" }}
              variant="link"
              to={PAGE_ROUTES.SIGNUP}
              text="Create an account"
            />
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForm;
