import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantRow = ({ applicant, onApprove, onReject }) => {
  return (
    <tr key={applicant._id}>
      <td className="border px-4 py-2">{applicant._id}</td>
      <td className="border px-4 py-2">{applicant.fullName}</td>
      <td className="border px-4 py-2">{applicant.email}</td>
      <td className={`border px-4 py-2 ${applicant.approved ? 'text-green-600' : applicant.notApproved ? 'text-red-600' : ''}`}>
        {applicant.approved ? 'Approved' : applicant.notApproved ? 'Not Approved' : 'Pending'}
      </td>
      <td className="border px-4 py-2">
        <ul>
          {applicant.verifiedDocuments.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </td>
      <td className="border px-4 py-2">
        {(!applicant.approved && !applicant.notApproved) && (
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load applicants from the API when the component mounts
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/applicants');
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Could not load applicants.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/details/${id}/approve`, { approved: true, notApproved: false });
      setApplicants(applicants.map(applicant => 
        applicant._id === id ? { ...applicant, approved: true, notApproved: false } : applicant
      ));
    } catch (error) {
      console.error('Error approving applicant:', error);
      setError('Could not approve applicant.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/details/${id}/reject`, { approved: false, notApproved: true });
      setApplicants(applicants.map(applicant => 
        applicant._id === id ? { ...applicant, approved: false, notApproved: true } : applicant
      ));
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setError('Could not reject applicant.');
    }
  };

  const filteredApplicants = applicants.filter(applicant => 
    applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center">Loading applicants...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto py-10">
      <section>
        <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

        {/* Search Input */}
        <div className="mb-4 border-2 flex items-center p-2 rounded-3xl text-gray-500">
          <input    
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none px-4 py-2 rounded-lg w-full"
          />
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 text-left">ID</th>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Documents</th>
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
