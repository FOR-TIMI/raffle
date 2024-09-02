import Blob from "../../assets/icon/Blob";
import Logo from "../../assets/icon/logo";

type Props = {
  title: string;
  subtitle: string;
};

const AuthBanner = ({ title, subtitle }: Props) => {
  return (
    <div className="max-xl:hidden w-[50%] h-[100%] bg-[#174B30] relative top-0 left-0 overflow-hidden">
      <div className="flex flex-col justify-center items-center h-full">
        <Logo width="200px" height="50px" />
        <h2 className="text-[#D0EAC3] font-[25px] font-bold text-2xl">
          {title}
        </h2>
        <p className="text-[#D0EAC3] font-light">{subtitle}</p>
      </div>

      <div className="blobs">
        <div className="absolute top-0">
          {/* Clircle at top left  */}
          <Blob
            sx={{
              position: "absolute",
              top: "-100px",
              right: "-200px",
              borderRadius: "50%",
              border: "50px solid #537F68",
              zIndex: 1,
            }}
          />
        </div>
        <div>
          {/* Clircle at bottom right  */}
          <Blob
            sx={{
              position: "absolute",
              bottom: "-130px",
              right: "-160px",
              borderRadius: "50%",
              border: "50px solid #537F68",
              zIndex: 1,
            }}
          />
        </div>
        <div className="">
          {/* Square at center  */}
          <Blob
            sx={{
              position: "absolute",
              top: "100px",
              right: "70px",
              rotate: "45deg",
              backgroundColor: "#537F68",
              zIndex: 1,
              width: "100px",
              height: "100px",
            }}
          />
        </div>
        <div className="">
          {/* Square at center  */}
          <Blob
            sx={{
              position: "absolute",
              top: "600px",
              left: "40px",
              rotate: "45deg",
              backgroundColor: "#537F68",
              zIndex: 1,
              width: "100px",
              height: "100px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;
