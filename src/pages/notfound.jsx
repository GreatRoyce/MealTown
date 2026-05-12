import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-center px-4">
      <div className="animate-bounce text-7xl font-extrabold text-blue-700 mb-4">404</div>
      <h2 className="text-3xl font-semibold text-gray-800">Lost in the Web</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        Looks like the page you're searching for took a wrong turn. But don't worry—we'll guide you back.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition duration-300"
      >
        <span>🏠</span> Return Home
      </Link>
    </div>
  );
}

export default NotFound;
