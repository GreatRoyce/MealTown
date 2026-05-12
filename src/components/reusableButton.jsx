import React from "react";

const VARIANT_STYLES = {
  primary:
    "px-6 py-2 rounded-lg border border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700 transition-colors duration-200 font-medium shadow-sm",
  secondary:
    "px-6 py-2 rounded-lg border border-black bg-black text-white hover:bg-white hover:text-black transition-colors duration-200 font-medium shadow-sm",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  outline:
    "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

function ReusableButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary", // default variant
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
                  ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default ReusableButton;
