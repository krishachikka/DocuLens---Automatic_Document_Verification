import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    // Check if user is logged in by checking localStorage for token
    const isLoggedIn = !!localStorage.getItem('token');
    const location = useLocation();

    // Determine whether to show the buttons based on the current location
    const showSignInSignUpButtons = location.pathname === '/signin' || location.pathname === '/signup';

    return (
        <header className="bg-[#22223B] text-white shadow-lg">
            <nav className="container mx-auto p-6 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/">DocuLens</Link>
                </div>

                {/* Links */}
                <ul className="flex justify-around w-[80%] ">
                    <li>
                        <Link to="/" className="hover:text-gray-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-400">About</Link>
                    </li>
                    {/* Conditionally render the Upload button if the user is logged in */}
                    {isLoggedIn && (
                        <li>
                            <Link to="/upload" className="hover:text-gray-400">Upload</Link>
                        </li>
                    )}
                </ul>

                {/* Action Buttons */}
                <div className="space-x-4 flex items-center">
                    {isLoggedIn ? (
                        <>
                            {/* Profile Icon */}
                            <Link to="/home" className="text-white hover:text-gray-400">
                            <ion-icon name="person-circle-outline" size="large"></ion-icon>
                            </Link>
                            <button
                                className="bg-[#4A4E69] hover:bg-gray-600 text-white py-2 px-4 rounded-3xl"
                                onClick={() => {
                                    // Handle sign out functionality
                                    localStorage.removeItem('token'); // Clear token
                                    localStorage.removeItem('username'); // Clear username
                                    window.location.reload(); // Reload the page to update state
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Show Sign In button if on the Sign Up page */}
                            {location.pathname === '/signup' && (
                                <Link to="/signin">
                                    <button className="bg-[#4A4E69] hover:bg-gray-600 text-white py-2 px-4 rounded-3xl">
                                        Sign In
                                    </button>
                                </Link>
                            )}
                            {/* Show Sign Up button if on the Sign In page */}
                            {location.pathname === '/signin' && (
                                <Link to="/signup">
                                    <button className="bg-[#C9ADA7] hover:bg-[#9A8C98] text-white py-2 px-4 rounded-3xl">
                                        Sign Up
                                    </button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
