import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Access user data using useUser hook
  const [availableBooks, setAvailableBooks] = useState([]);
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    fetchBooksInfo();
    fetchReadBooks();
  }, []);

  const fetchBooksInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/circulation/fetchBooksInfo');
      if (!response.ok) {
        throw new Error('Failed to fetch books information');
      }
      const data = await response.json();
      setAvailableBooks(data.allAvailableBooks);
      setCheckedOutBooks(data.checkedOutBooksByAllUsers);
    } catch (error) {
      console.error('Error fetching books information:', error);
    }
  };

  const fetchReadBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/circulation/read-books/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch read books');
      }
      const data = await response.json();
      setReadBooks(data);
    } catch (error) {
      console.error('Error fetching read books:', error);
    }
  };

  const userCheckedOutBooks = checkedOutBooks.filter(book => book.user_id === user.id);

  return (
    <div className='user-dash'>
      <h2>Welcome User</h2>
      <div className="user-dash-section">
        <h3>Statistics</h3>
        <ul>
          <li>Books available to check out: {availableBooks.length}</li>
          <li>Active checked out books: {userCheckedOutBooks.length}</li>
          <li>Books read so far: {readBooks.length}</li>
          <li>Favorite books count: {favoriteBooks.length}</li>
        </ul>
      </div>

      <div className="user-dash-button-container">
        <button className="user-button" onClick={() => navigate('/books')}>View Catalogue</button>
        <button className="user-button" onClick={() => navigate('/profile')}>View Profile</button>
        <button className="user-button" onClick={() => navigate('/check-in-out')}>Check In/Out</button>
        <button className="user-button" onClick={() => navigate('/reserve-books')}>Reserve a Book</button>
      </div>
    </div>
  );
};

export default UserDashboard;
