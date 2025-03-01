import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import logo from "/hackRare.png";

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate("/quiz");
  };
  return (
    <>
      <nav className="fixed w-full z-20 shadow-lg bg-engred">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              <img src={logo} alt="logo" className="w-10 h-10 mr-2" />
            </Link>
            <span className="hidden sm:block text-xl font-semibold font-mono text-amber-50">
              NAL
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <div className="pt-3 md:flex space-x-6">
              <Link to="/" className="text-white hover:text-amber-50">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-amber-50">
                About
              </Link>
              <Link to="/resources" className="text-white hover:text-amber-50">
                Resources
              </Link>
            </div>
            <Button
              text="Quiz"
              color="black"
              onClick={handleQuiz}
              transparent={false}
              className="text-black"
            />
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="focus:outline-none"
              style={{ color: "var(--color-engred)" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {navbarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {navbarOpen && (
        <div
          className="md:hidden fixed top-16 left-0 w-full shadow-lg z-10"
          style={{ backgroundColor: "var(--color-white)" }}
        >
          <div className="px-4 pt-2 pb-3 space-y-3">
            <Link
              to="/"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono hover:opacity-80"
              style={{ color: "var(--color-black)" }}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono hover:opacity-80"
              style={{ color: "var(--color-black)" }}
            >
              About
            </Link>
            <Link
              to="/resources"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono hover:opacity-80"
              style={{ color: "var(--color-black)" }}
            >
              Resources
            </Link>
            {/* Logout Button */}
            <Button
              text="Quiz"
              onClick={() => {
                setNavbarOpen(false);
                handleQuiz();
              }}
              color="engred"
              transparent={false}
              className="text-engred"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
