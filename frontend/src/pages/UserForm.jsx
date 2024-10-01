import React, { useState } from 'react';

const UserForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!formData.fullName || !formData.dob || !formData.gender) {
      alert('Please fill all fields before submitting.');
      return;
    }

    // Split the full name into parts
    const nameParts = formData.fullName.split(' ');
    const [name, fatherName, surname] = nameParts.length >= 3 
      ? [nameParts[0], nameParts[1], nameParts.slice(2).join(' ')]
      : [nameParts[0], '', nameParts.slice(1).join(' ')];

    // Store form data in localStorage
    localStorage.setItem('userInfo', JSON.stringify({ name, fatherName, surname, dob: formData.dob, gender: formData.gender }));

    // Show submission message
    setIsSubmitted(true);
    setUserDetails({ name, fatherName, surname });

    // Retrieve and log the stored data from localStorage
    const storedData = JSON.parse(localStorage.getItem('userInfo'));
    console.log('Stored Form Data:', storedData); // Display the stored form data in the console
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">User Information Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name (First Father Surname)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Date of Birth Input */}
          <div className="mb-4">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Gender Selection */}
          <div className="mb-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>

        {/* Show success message if submitted */}
        {isSubmitted && (
          <div className="mt-4 text-center">
            <p className="text-green-500">Form submitted successfully!</p>
            <p className="mt-2 font-semibold">Full Name: {userDetails.name} {userDetails.fatherName} {userDetails.surname}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;
