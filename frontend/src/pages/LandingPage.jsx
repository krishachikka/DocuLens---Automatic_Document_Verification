import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
      {/* Hero Section */}
      <header className="bg-[#22223B] text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl mb-8">The best place to manage your tasks and collaborate efficiently.</p>
          <Link to="/signup">
            <button className="bg-white text-black px-6 py-3 rounded-3xl shadow-lg font-semibold hover:bg-gray-200 hover:scale-105 hover:font-bold transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 m-4">
            {/* Feature 1 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Feature One</h3>
              <p>Efficient task management to boost productivity.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Feature Two</h3>
              <p>Collaborate with your team seamlessly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Feature Three</h3>
              <p>Access everything on any device, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#4A4E69] text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start for Free</h2>
          <p className="text-lg mb-8">Sign up today and take control of your projects.</p>
          <Link to="/signup">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-green-200">
              Create an Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
