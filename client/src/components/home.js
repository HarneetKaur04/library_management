import React from 'react';
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';
import './home.css';

const Home = () => {
  const { isAdmin } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
  const { user } = useUser(); // Use the useUser hook to get user data

  return (
    <div className="home">
      <div className="library-image">
        <img src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg?t=st=1713833541~exp=1713837141~hmac=5a2b2523839e4a83f92672ff22a5807351c0e3f3c178c5f2196724a1cd2fd665&w=2000" alt="Library" />
        {user ? (
          <div className="dashboard-card">
            {isAdmin ? <AdminDashboard/> : <UserDashboard />}
          </div>
        ) : (
          <div className="login-card">
            <Login />
          </div>
        )}
      </div>
        

    </div>
  );
};

export default Home;
