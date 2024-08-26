import React from "react";

type Props = {};

const TriangleBlob = (props: Props) => {
  return (
    <svg
      width="78"
      height="182"
      viewBox="0 0 78 182"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1285_660)">
        <path
          d="M50.9733 4.78767L177.734 131.549L4.57554 177.947L50.9733 4.78767Z"
          fill="url(#paint0_linear_1285_660)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1285_660"
          x="0.575439"
          y="0.787598"
          width="181.159"
          height="181.159"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2"
            result="effect1_foregroundBlur_1285_660"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1285_660"
          x1="50.9733"
          y1="4.78767"
          x2="104.549"
          y2="204.734"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#537F68" />
          <stop offset="1" stopColor="#416C56" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TriangleBlob;
