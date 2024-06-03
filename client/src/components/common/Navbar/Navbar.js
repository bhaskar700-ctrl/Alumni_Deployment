import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Access authentication state
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/dashboard" className="flex items-center py-4 px-2">
                <img
                  src="https://www.tezu.ernet.in/images/tulogo.png"
                  alt="Logo"
                  className="h-8 w-8 mr-2"
                />
                <span className="font-semibold text-white text-lg">
                  Alumni Information System
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="#"
                className="py-4 px-2 text-yellow-500  border-b-4 border-yellow-500 font-semibold"
              >
                Home
              </a>
              <Link to="/about-us" className="py-4 px-2  text-gray-300 font-semibold hover:text-yellow-500 transition duration-300"
              >
                About
              </Link>
              <Link to="/contact-us"
                className="py-4 px-2 text-gray-300 font-semibold hover:text-yellow-500 transition duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          {!isAuthenticated && ( // Only render if not authenticated
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="py-2 px-2 font-medium text-gray-300 rounded hover:bg-yellow-500 hover:text-gray-800 transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="py-2 px-2 font-medium text-gray-800 bg-yellow-500 rounded hover:bg-yellow-400 transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-300 hover:text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <ul>
          <li>
            <a
              href="#"
              className="block text-sm px-2 py-4 text-gray-700 hover:bg-yellow-500 transition duration-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block text-sm px-2 py-4 text-gray-700 hover:bg-yellow-500 transition duration-300"
            >
              Services
            </a>
          </li>
          <li>
            <Link
              to="/about-us"
              className="block text-sm px-2 py-4 text-gray-700 hover:bg-yellow-500 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="block text-sm px-2 py-4 text-gray-700 hover:bg-yellow-500 transition duration-300"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
