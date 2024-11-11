/** Service */
import { Formik, FormikHelpers } from "formik";
import {
  UserSignupRequestBody,
  initialValues,
  schema,
  validateEmailAvailability,
} from "../config/signup";

/** Components */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TransitionAlerts from "../../../components/Common/Alert";
import TiLink from "../../../components/Common/TiLink";

/** Store */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../../../components/Common/TextField";
import { PAGE_ROUTES } from "../../../config/constants";
import { openAlertWithAutoClose } from "../../../features/alert/alertThunk";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { signUpUser } from "../authThunk";

/** Component */
const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const navigate = useNavigate();

  const handleFormSubmit = async (
    values: UserSignupRequestBody,
    onSubmitProp: FormikHelpers<UserSignupRequestBody>
  ) => {
    try {
      dispatch(signUpUser({ body: values }))
        .then(async () => {
          await dispatch(
            openAlertWithAutoClose("Verification Email Sent", "success", 8000)
          );
          onSubmitProp.resetForm();
          navigate(PAGE_ROUTES.HOME);
        })
        .catch((err) => {
          dispatch(
            openAlertWithAutoClose(
              err.message || "Something went wrong",
              "error",
              8000
            )
          );
        });
    } catch (err) {
      dispatch(
        openAlertWithAutoClose(
          err.message || "Something went wrong",
          "error",
          8000
        )
      );
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
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleFormSubmit}
      validateOnChange={false}
      validateOnBlur={true}
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
        setFieldError,
      }) => (
        <>
          <TransitionAlerts />
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
                autoComplete="given-name"
                labelText="First Name"
              />

              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                type="text"
                errors={errors}
                autoComplete="family-name"
                touched={touched}
                labelText="Last Name"
              />

              <TextField
                onBlur={async (e) => {
                  handleBlur(e);
                  await validateEmailAvailability(
                    e.target.value,
                    setFieldError
                  );
                }}
                onChange={handleChange}
                value={values.email}
                name="email"
                type="text"
                errors={errors}
                touched={touched}
                labelText="Email Address"
                autoComplete="email"
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
                autoComplete="new-password"
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
                autoComplete="new-password"
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
        </>
      )}
    </Formik>
  );
};

/** Export */
export default SignUpForm;
