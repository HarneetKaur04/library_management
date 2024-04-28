import React from 'react';
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';
import './Home.css';

const Home = () => {
  const { isAdmin } = useAdminStatus(); // Access isAdmin state using useAdminStatus hook
  const { user } = useUser(); // Access user data using useUser hook

  return (
    <div className="home">
      <div className="container">
        {user ? (
          isAdmin ? <AdminDashboard /> : <UserDashboard />
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};

export default Home;
