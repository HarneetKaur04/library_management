import React, {useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom"; // Import NavLink for active link styling
import './Navbar.css'; // Import CSS file
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';

const Navbar = () => {
  const { isAdmin, updateAdminStatus } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
  const { user, updateUser } = useUser(); // Use the useUser hook to get user data
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [suggestionsTop, setSuggestionsTop] = useState(0); // Initialize suggestionsTop state
  const searchRef = useRef(null);

  // Function to calculate the top position of search suggestions
  const calculateSuggestionsTop = () => {
    if (searchRef.current) {
      const searchBarRect = searchRef.current.getBoundingClientRect();
      const suggestionsTopValue = searchBarRect.bottom + window.scrollY + 10; // Add some extra space below the search bar
      setSuggestionsTop(suggestionsTopValue);
    }
  };

  useEffect(() => {
    calculateSuggestionsTop(); // Calculate initial top position
    window.addEventListener('resize', calculateSuggestionsTop); // Recalculate top position on window resize

    return () => {
      window.removeEventListener('resize', calculateSuggestionsTop); // Cleanup event listener
    };
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from context
    updateUser(null);
    
    // Clear admin status from context
    updateAdminStatus(false);

    // Redirect to the login page
    navigate('/login');
  };

  // Search options based on user input
  const searchOptions = [
    { label: "find a book", to: "/books" },
    { label: "check-in/check-out a book", to: "/check-in-out" },
    { label: "reserve a book", to: "/reserve-books" }
  ];

  // Filter search options based on user input
  const filteredOptions = searchOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="top">
      <div className="topLeft">
        <Link className="homeLink" to="/">
          LIBRARY MANAGEMENT SYSTEM
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
        <div className="search-bar-nav">
            <input
              type="text"
              placeholder="Search library resources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <ul className="search-suggestions" style={{ top: suggestionsTop }}>
              {filteredOptions.map(option => (
                <li key={option.to}>
                  <Link to={`${option.to}?query=${encodeURIComponent(searchQuery)}`} onClick={() => setSearchQuery('')}>{option.label}</Link>
                </li>
              ))}
            </ul>
          )}
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
