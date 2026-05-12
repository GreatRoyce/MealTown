import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import mtlogo from "../assets/mtlogo.png";
import { getStoredUser, logoutUser } from "../utils/api";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
    setUser(getStoredUser());

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemsCount(
      cart.reduce((total, item) => total + (item.quantity || 1), 0)
    );
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  const displayName = user?.userName || user?.username || user?.name || "Account";
  const displayEmail = user?.email || "Signed in user";

  const navLinks = [
    { to: "/", label: "Home", icon: "fa-house" },
    { to: "/orders", label: "Orders", icon: "fa-box-open" },
    { to: "/profile", label: "Profile", icon: "fa-user" },
    { to: "/rider", label: "Become a Rider", icon: "fa-motorcycle" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".profile-dropdown")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden mr-3 text-gray-700 hover:text-red-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isMenuOpen ? "fa-xmark text-xl" : "fa-bars text-lg"}`}></i>
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div
                style={{ backgroundImage: `url(${mtlogo})` }}
                className="w-44 h-44 flex items-center justify-center bg-center bg-no-repeat bg-contain"
              ></div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <i className={`fa-solid ${link.icon} text-sm`}></i>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-red-700 transition-colors"
              aria-label="Cart"
            >
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 9 ? "9+" : cartItemsCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-user text-gray-600"></i>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">{displayName}</span>
                  <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-10">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{displayEmail}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 text-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="fa-solid fa-user text-sm"></i>
                      <span className="text-sm">My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 text-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="fa-solid fa-box-open text-sm"></i>
                      <span className="text-sm">My Orders</span>
                    </Link>

                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-3 hover:bg-red-50 text-red-600"
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 border border-red-600 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  <i className="fa-solid fa-key"></i>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-6">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive
                        ? "bg-red-50 text-red-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <i className={`fa-solid ${link.icon} w-5 text-center`}></i>
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              ))}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 border border-red-600 text-red-700 rounded-lg font-medium mt-4"
                  >
                    <i className="fa-solid fa-key"></i>
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-red-600 text-white rounded-lg font-medium"
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
