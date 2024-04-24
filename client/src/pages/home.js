import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';

const Home = () => {
  const { isAdmin } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
  const { user } = useUser(); // Use the useUser hook to get user data

  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from context
    updateUser(null);
    
    // Clear admin status from context
    useAdminStatus(false);

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="home">
      <div className="library-image">
        <img src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg?t=st=1713833541~exp=1713837141~hmac=5a2b2523839e4a83f92672ff22a5807351c0e3f3c178c5f2196724a1cd2fd665&w=2000" alt="Library" />
      </div>
      <div className="dashboard-card">
        {user ? (
          <div className="card">
            {isAdmin ? <AdminDashboard/> : <UserDashboard />}
          </div>
        ) : (
          <div className="card">
            <h2>Sign In</h2>
            <Login />
            <p>Not a member? <Link to="/register">Register</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
