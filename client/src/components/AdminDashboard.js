// AdminDashboard.js
import React from 'react';

const AdminDashboard = () => {
  const handleViewUsers = () => {
    // Logic to view all users
  };

  const handleDeleteUser = (userId) => {
    // Logic to delete user with userId
  };

  return (
    <>
      <h2>Welcome Admin</h2>
      <p>Here's your Admin Dashboard.</p>
      {/* Example buttons to view users and delete users */}
      <button onClick={handleViewUsers}>View All Users</button>
      <button onClick={() => handleDeleteUser(userId)}>Delete User</button>
    </>
  );
};

export default AdminDashboard;
