import { SVGProps } from "react";

export default function BlueCheckMarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Purple Circle */}
      <circle cx="50" cy="50" r="50" fill="#3B49DF" />
      {/* White Check */}
      <path
        d="M30 55 L45 70 L70 40"
        stroke="#fff"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
