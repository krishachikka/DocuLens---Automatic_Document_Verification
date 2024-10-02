import React, { useState, useEffect } from 'react';
import axios from 'axios';

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const ApplicantRow = ({ applicant, onApprove, onReject }) => {
  const age = applicant.dob ? calculateAge(applicant.dob) : 'N/A';

  return (
    <tr key={applicant._id}>
      <td className="border px-4 py-2">{applicant._id}</td>
      <td className="border px-4 py-2">{applicant.fullName}</td>
      <td className="border px-4 py-2">{age}</td>
      <td className="border px-4 py-2">{applicant.gender || 'N/A'}</td>
      <td className="border px-4 py-2">{applicant.pdfUploaded ? 'Yes' : 'No'}</td>
      <td className={`border px-4 py-2 ${applicant.status === 'Approved' ? 'text-green-600' : applicant.status === 'Rejected' ? 'text-red-600' : ''}`}>
        {applicant.status || 'Pending'}
      </td>
      <td className="border px-4 py-2">
        {applicant.status === 'Pending' && (
          <>
            <button
              className="bg-green-500 text-white px-4 py-1 mr-2 rounded-3xl hover:bg-green-600 transition"
              onClick={() => onApprove(applicant._id)}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-3xl hover:bg-red-600 transition"
              onClick={() => onReject(applicant._id)}
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

function Admin() {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch applicants from the backend
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/applicants');
        setApplicants(response.data); // Set the fetched applicants to the state
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, []);

  // Function to handle approval
  const handleApprove = (id) => {
    setApplicants(applicants.map(applicant =>
      applicant._id === id ? { ...applicant, status: 'Approved' } : applicant
    ));
  };

  // Function to handle rejection
  const handleReject = (id) => {
    setApplicants(applicants.map(applicant =>
      applicant._id === id ? { ...applicant, status: 'Rejected' } : applicant
    ));
  };

  // Filtered applicants based on search term
  const filteredApplicants = applicants.filter(applicant =>
    applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-10">
      <section>
        <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

        {/* Search Input */}
        <div className="mb-4 border-2 flex items-center p-2 rounded-3xl text-gray-500 focus:ring-4">
          <ion-icon name="search"></ion-icon>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none px-4 py-2 rounded-lg w-full focus:ring-none"
          />
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 text-left">ID</th>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Age</th>
              <th className="py-2 text-left">Gender</th>
              <th className="py-2 text-left">PDF Uploaded</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map(applicant => (
              <ApplicantRow
                key={applicant._id}
                applicant={applicant}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Admin;
    