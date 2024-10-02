import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-[#22223B] text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to DocuLens</h1>
          <p className="text-xl mb-8">The ultimate solution for fast, accurate, and automated document verification.</p>
          <Link to={isLoggedIn ? "/recruitment-dashboard" : "/signup"}>
            <button className="bg-white text-black px-6 py-3 rounded-3xl shadow-lg font-semibold hover:bg-gray-200 hover:scale-105 hover:font-bold transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8 m-4">
            {/* Feature 1 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Accurate Data Extraction</h3>
              <p>Extract information with precision using advanced AI, Machine Learning, and Natural Language Processing.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Instant Alerts</h3>
              <p>Notify applicants of any discrepancies instantly to catch mismatches early.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Fast Processing</h3>
              <p>Process documents in under 3 seconds to save valuable time in application screening.</p>
            </div>

            {/* Feature 4 */}
            {/* <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Multi-Language Support</h3>
              <p>Handle documents in various languages to ensure no data is missed.</p>
            </div> */}

            {/* Feature 5 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Seamless Integration</h3>
              <p>Use modern business intelligence tools to visualize the extracted data effectively.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F2E9E4] p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Why Choose DocuLens?</h3>
              <p>Transform manual verification into a streamlined, automated solution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#4A4E69] text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get Started Now</h2>
          <p className="text-lg mb-8">Start automating your document verification process today!</p>
          <Link to={isLoggedIn ? "/recruitment-dashboard" : "/signup"}>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-green-200">
              Create an Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} DocuLens. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
