import * as React from "react";

const Toggle = (props: { onClickHandle: () => void }) => {
  return (
    <div
      onClick={() => props?.onClickHandle()}
      className="absolute top-1/2 select-none"
      style={{ right: "-12px", zIndex: 1, transform: "translateY(-50%)" }}
    >
      <svg
        width="15"
        height="96"
        fill="#404854"
        viewBox="0 0 15 96"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 0 C3.0011 4.42584 3.9102 9.9 7.2 13.28C7.45 13.4625 7.6 13.6 7.7 13.8048L7.8 13.8C9.8 15.8 11.6 17.6 12.9 19.7C14.0 21.6 14.7 23.9 14.9 27H15V68C15 71.7 14.3 74.3 13.0 76.6C11.7 78.8 9.9 80.5 7.8 82.6344L7.79 82.6C7.6 82.8 7.4507 83 7.27295 83.2127C3.9102 86.5228 3.0011 92.0739 3 95.4938"></path>
      </svg>
      <div className="close">{">"}</div>
    </div>
  );
};

export default Toggle;
