import React from "react";

const GoogleButton = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="h-[46px] cursor-pointer border border-blue-100 flex items-center gap-2 px-3 rounded-[4px] my-2 bg-[rgba(210,227,252,0.3)]">
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 1.84 1.84"
          data-name="Layer 1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.366 0.92a0.445 0.445 0 0 1 -0.864 0.151l-0.255 0.204A0.762 0.762 0 0 0 1.682 0.92"
            fill="#00ac47"
          />
          <path
            d="M1.366 0.92a0.445 0.445 0 0 1 -0.187 0.362l0.252 0.202A0.759 0.759 0 0 0 1.682 0.92"
            fill="#4285f4"
          />
          <path
            d="M0.474 0.92a0.443 0.443 0 0 1 0.027 -0.151L0.246 0.565a0.758 0.758 0 0 0 0 0.71l0.255 -0.204A0.443 0.443 0 0 1 0.474 0.92"
            fill="#ffba00"
          />
          <path
            fill="#2ab2db"
            points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
            d="M0.501 0.769L0.501 0.769L0.501 0.769L0.501 0.769Z"
          />
          <path
            d="M0.92 0.474a0.443 0.443 0 0 1 0.262 0.086l0.233 -0.218A0.76 0.76 0 0 0 0.246 0.565l0.255 0.204A0.446 0.446 0 0 1 0.92 0.474"
            fill="#ea4435"
          />
          <path
            fill="#2ab2db"
            points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
            d="M0.501 1.071L0.501 1.071L0.501 1.071L0.501 1.071Z"
          />
          <path
            d="M1.682 0.863v0.058L1.552 1.121H0.949V0.805h0.676a0.058 0.058 0 0 1 0.058 0.058"
            fill="#4285f4"
          />
        </svg>
        <span className="text-[16px] opacity-[.8] font-Poppins">
            Sign In with Google
        </span>
      </div>
    </div>
  );
};

export default GoogleButton;
