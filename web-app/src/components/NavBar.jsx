import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import logo from "/hackRare.png";

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate("/quiz");
  };

  return (
    <>
      {/* Navbar container */}
      <nav className="fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <img src={logo} alt="logo" className="w-10 h-10 mr-2" />
            </Link>
            <span className="hidden sm:block text-xl font-semibold text-mediumblue">
              PhenoQ
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <div className="flex space-x-6">
              <Link to="/" className="text-darkblue font-light hover:text-mediumblue">
                Home
              </Link>
              <Link to="/about" className="text-darkblue font-light hover:text-mediumblue">
                About
              </Link>
              <Link
                to="/resources"
                className="text-darkblue font-light hover:text-mediumblue"
              >
                Resources
              </Link>
            </div>
            <button
              onClick={handleQuiz}
              transparent={false}
              className="text-ivory font-light bg-mediumblue px-6 py-2 border-2 border-medium transition-colors duration-300 rounded-full hover:bg-green"
            >
              Quiz 
            </button>
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
        <div className="md:hidden fixed top-16 left-0 w-full shadow z-10 bg-white">
          <div className="px-4 pt-2 pb-3 space-y-3">
            <Link
              to="/"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono text-slate-800 hover:text-slate-600"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono text-slate-800 hover:text-slate-600"
            >
              About
            </Link>
            <Link
              to="/resources"
              onClick={() => setNavbarOpen(false)}
              className="block font-mono text-slate-800 hover:text-slate-600"
            >
              Resources
            </Link>
            {/* Quiz Button */}
            <Button
              text="Quiz"
              onClick={() => {
                setNavbarOpen(false);
                handleQuiz();
              }}
              color="engred"
              transparent={false}
              className="text-white bg-engred hover:bg-red-600"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;

