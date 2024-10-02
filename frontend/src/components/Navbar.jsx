import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    // Check if user is logged in by checking localStorage for token
    const isLoggedIn = !!localStorage.getItem('token');
    const location = useLocation();

    // Retrieve username and email from local storage
    const username = localStorage.getItem('username') || 'Guest';
    const email = localStorage.getItem('email') || '';

    // State to toggle profile dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Reference for the dropdown container
    const dropdownRef = useRef(null);

    // Toggle dropdown for profile
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Close dropdown if clicked outside
            }
        }

        // Add event listener to detect clicks outside of the dropdown
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Clean up the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="bg-[#22223B] text-white shadow-lg">
            <nav className="container mx-auto p-6 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/">DocuLens<ion-icon name="search"></ion-icon></Link>
                </div>

                {/* Links */}
                <ul className="flex justify-around w-[80%]">
                    <li>
                        <Link to="/" className="hover:text-gray-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-400">About</Link>
                    </li>
                    {/* Conditionally render the Upload button if the user is logged in */}
                    {isLoggedIn && (
                        <li>
                            <Link to="/notifications" className="hover:text-gray-400"><ion-icon name="notifications" ></ion-icon> My Notifications</Link>
                        </li>
                    )}
                </ul>

                {/* Action Buttons */}
                <div className="space-x-4 flex items-center relative">
                    {isLoggedIn ? (
                        <>
                            {/* Profile Icon */}
                            <button
                                className="text-white hover:text-gray-400"
                                onClick={toggleDropdown}
                            >
                                <ion-icon name="person-circle-outline" size="large"></ion-icon>
                            </button>

                            {/* Profile Dropdown */}
                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-32 py-2 w-60 bg-white rounded-lg shadow-xl text-black z-20"
                                >
                                    <div className="px-4 py-2">
                                        <p className="font-semibold">Welcome, {username}!</p>
                                        {email && <p className="text-sm text-gray-500">{email}</p>}
                                    </div>
                                    <hr />
                                    <button
                                        onClick={() => {
                                            // Handle logout
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('username');
                                            localStorage.removeItem('email'); // Clear email as well
                                            window.location.reload(); // Reload to update state
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {location.pathname === '/signup' && (
                                <Link to="/signin">
                                    <button className="bg-[#4A4E69] hover:bg-gray-600 text-white py-2 px-4 rounded-3xl">
                                        Sign In
                                    </button>
                                </Link>
                            )}
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
