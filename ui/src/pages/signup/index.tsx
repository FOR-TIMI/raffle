import AuthBanner from "../../components/Common/AuthBanner";
import SignUpForm from "../../features/auth/form/signup";

type Props = {};

const SignUpPage = (props: Props) => {
  return (
    <div className="flex lg:h-[100vh] lg:justify-center lg:items-center max-w-[91%] mx-auto my-12 lg:mx-0  md:my-3 lg:my-0 md:min-h-[700px] md:justify-center md:items-center">
      <AuthBanner
        title="Welcome to our platform"
        subtitle="Create an account to get started"
      />

      <div className="w-[50%] max-lg:w-[100%]">
        <div className="text-center">
          <h2 className="font-semibold text-2xl ">Create An Account</h2>
          <p className="text-[#1D1D1D] font-light">
            Enter your details to sign in to your account
          </p>
        </div>

        <div className="max-w-[600px] xl:max-w-[400px] mx-auto my-3 ">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
