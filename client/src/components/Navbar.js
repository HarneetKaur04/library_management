import React from 'react';
import { Link } from "react-router-dom";
import './Navbar.css'; // Import CSS file
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';

const Navbar = () => {
  const { isAdmin, updateAdminStatus } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
  const { user, updateUser } = useUser(); // Use the useUser hook to get user data
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from context
    updateUser(null);
    
    // Clear admin status from context
    updateAdminStatus(false);

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="top">
      <div className="topLeft">
        <Link className="homeLink" to="/">
          LMS
        </Link>
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/books">
              ALL BOOKS
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/myparks">
              ADD BOOKS
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/contact">
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      <div className="topRight">
        {user ? (
          <>
            <Link className="link" to={isAdmin ? "/admin/profile" : "/user/profile"}>
              {isAdmin ? `Hello Admin` : `Hello ${user.username}`}
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link className="link" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
