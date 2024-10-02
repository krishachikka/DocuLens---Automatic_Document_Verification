import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [finalNotification, setFinalNotification] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/applicants'); // Use the appropriate endpoint
        const applicantNotifications = response.data.map(applicant => {
          if (applicant.approved) {
            return `Your application for ${applicant.fullName} has been approved.`;
          } else if (applicant.notApproved) {
            return `Your application for ${applicant.fullName} has been rejected.`;
          }
          return null;
        }).filter(Boolean);

        setNotifications(applicantNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Could not load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Get the final notification if it exists
    const storedNotification = localStorage.getItem('finalNotification');
    if (storedNotification) {
      setFinalNotification(storedNotification);
      localStorage.removeItem('finalNotification'); // Clear it after reading
    }
  }, []);

  if (loading) return <div className="text-center">Loading notifications...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Notifications</h1>
      {finalNotification && (
        <div className="text-blue-800 mb-2 bg-[#F2E9E4] m-20 p-4 rounded-3xl">
          {finalNotification}
        </div>
      )}
      <ul className="list-disc pl-6">
        {notifications.map((notification, index) => (
          <li key={index} className="mb-2 bg-[#F2E9E4] m-20 p-4 rounded-3xl">{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
