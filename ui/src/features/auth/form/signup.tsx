/** Service */
import { Formik, FormikHelpers } from "formik";
import {
  RequestBody,
  initialValues,
  schema,
  signUpApi,
} from "../config/signup";

/** Components */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TransitionAlerts from "../../../components/common/Alert";
import TiLink from "../../../components/common/TiLink";

/** Store */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../../../components/common/TextField";
import { PAGE_ROUTES } from "../../../config/constants";
import { openAlertWithAutoClose } from "../../../features/alert/alertThunk";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

/** Component */
const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const navigate = useNavigate();

  const handleFormSubmit = async (
    values,
    onSubmitProp: FormikHelpers<RequestBody>
  ) => {
    try {
      const res = await signUpApi(values);
      if (res.status.toString().startsWith("4")) {
      } else {
        dispatch(
          openAlertWithAutoClose("Verification Email sent", "success", 8000)
        );
        navigate(PAGE_ROUTES.LOGIN);
      }
    } catch (err) {
      dispatch(
        openAlertWithAutoClose(
          !err.response.data.message ? err.message : err.response.data.message,
          "error",
          3000
        )
      );
      console.error(err);
    } finally {
      onSubmitProp.resetForm();
    }
  };

  const handleClickShowPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const fieldName = event.currentTarget.name;
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
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
            <Box>
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

              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                type="text"
                errors={errors}
                touched={touched}
                labelText="Last Name"
              />

              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                type="text"
                errors={errors}
                touched={touched}
                labelText="Email Address"
              />

              <TextField
                showPassword={passwordVisibility.password}
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

              <TextField
                showPassword={passwordVisibility.passwordConfirmation}
                handleClickShowPassword={handleClickShowPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirmation}
                name="passwordConfirmation"
                type="password"
                errors={errors}
                touched={touched}
                labelText="Confirm Password"
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
                  <Typography color="#D0EAC3">Sign Up</Typography>
                )}
              </Button>
            </Box>

            <Box
              textAlign="center"
              width="100%"
              margin="1rem 0 2rem 0"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                component="span"
                color="#1D1D1D"
                variant="subtitle1"
                mr="6px"
              >
                Have an account?
              </Typography>
              <TiLink variant="link" to={PAGE_ROUTES.LOGIN} text="Sign In" />
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

/** Export */
export default SignUpForm;
