import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-[#22223B] text-white shadow-lg">
      <nav className="container mx-auto p-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">DocuLens</Link>
        </div>

        {/* Links */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400">
              About
            </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="space-x-4">
          <Link to="/signin">
            <button className="bg-[#4A4E69] hover:bg-gray-600 text-white py-2 px-4 rounded-3xl">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#C9ADA7] hover:bg-[#9A8C98] text-white py-2 px-4 rounded-3xl">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
