import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function LoginPop({ onClose }) {
  // Close on any key press
  useEffect(() => {
    const handleKeyPress = () => onClose();
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onClose]);

  // Close when clicking outside popup
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Welcome Back</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please log in to continue
        </p>

        <div className="flex justify-center">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPop;
