import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signup', formData);

            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username);
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'An error occurred. Please try again.');
            } else if (error.request) {
                setError('No response from the server. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9A8C98] to-[#22223B] flex items-center justify-center">
            <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-black mb-6">Sign Up</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={handleChange}
                        value={formData.username}
                        className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#4A4E69]"
                    />
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        onChange={handleChange}
                        value={formData.email}
                        className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#4A4E69]"
                    />
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={handleChange}
                        value={formData.password}
                        className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#4A4E69]"
                    />
                    <button
                        type="submit"
                        className="bg-[#22223B] text-white font-bold p-3 rounded-3xl shadow hover:bg-[#C9ADA7] hover:text-black transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-10 text-center">Already have an account? <Link to="/signin" className="text-[#22223B] font-extrabold hover:underline">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Signup;