import React from 'react';
import { Link } from "react-router-dom"; // Import NavLink for active link styling
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
            <div className="dropdown">
              <button className="dropbtn">Books</button>
              <div className="dropdown-content">
                <Link to="/books">View Books</Link>
                {user ? <Link to="/add-books">Add Books</Link> : <Link to="/login">Add Books</Link>}
              </div>
            </div>
          </li>
          {isAdmin && (
            <li className="topListItem">
              <div className="dropdown">
                <button className="dropbtn">Users</button>
                <div className="dropdown-content">
                  <Link to="/view-users">View Users</Link>
                  <Link to="/register">Add Users</Link>
                </div>
              </div>
            </li>
          )}
          {user ? (
            <>
              <li className="topListItem">
                <Link className="link" to="/check-in-out">
                  Check-In/Check-Out
                </Link>
              </li>
              <li className="topListItem">
                <Link className="link" to="/reserve-books">
                  Reserve Books
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="topListItem">
                <Link className="link" to="/login">
                  Check-In/Check-Out
                </Link>
              </li>
              <li className="topListItem">
                <Link className="link" to="/login">
                  Reserve Books
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="topRight">
        {user ? (
          <>
            <Link className="link" to={"/profile"}>
              {isAdmin ? `Hello admin` : `Hello ${user.username}`}
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
