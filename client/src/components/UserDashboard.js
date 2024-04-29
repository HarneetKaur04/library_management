import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './UserDashboard.css'; // Import CSS file for styling

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [allBooks, setAllBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);

  useEffect(() => {
    fetchAllBooks();
    fetchBooksInfo();
    fetchReadBooks();
    fetchFavoriteBooks();
    fetchReservedBooks();
  }, []);

  const fetchBooksInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/circulation/fetchBooksInfo');
      if (!response.ok) {
        throw new Error('Failed to fetch books information');
      }
      const data = await response.json();
      setAvailableBooks(data.allAvailableBooks);
      const userCheckedOutBooks = data.checkedOutBooksByAllUsers.filter(book => book.user_id === user.id);
      setCheckedOutBooks(userCheckedOutBooks);
    } catch (error) {
      console.error('Error fetching books information:', error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAllBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchFavoriteBooks = async () => {
    try {
      // Wait for allBooks to be populated
      await fetchAllBooks();
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFavoriteBooks(data.favoriteBooks);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
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

  const fetchReservedBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/circulation/reserved-books');
      if (!response.ok) {
        throw new Error('Failed to fetch reserved books');
      }
      const data = await response.json();
      const userReservedBooks = data.reservedBooks.filter(book => book.user_id === user.id);
      setReservedBooks(userReservedBooks);
    } catch (error) {
        console.error('Error fetching reserved books:', error);
    }
  };

  const handleFavoriteToggle = async (bookId, favorited) => {
    try {
      if (favorited) {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books/${bookId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }
      fetchFavoriteBooks();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className='user-dash' data-testid="user-dashboard-component">
      <br/>
      <h2>Welcome <span style={{ color: '#79670e' }}>{user.username}</span> to your Personalized Dashboard!</h2>
      <br/>
      <div className="grid-container">
        {/* Available Books */}
        <div className="grid-item">
          <div className="user-dash-section">
            <h3>
              <button className="dash-heading-btn" onClick={() => navigate('/check-in-out')}>
                Books available to check-out ({availableBooks.length})
              </button>
            </h3>
            <ul>
              {availableBooks.map(book => (
                <li className= "user-dash-list" key={book.id}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Checked Out Books */}
        <div className="grid-item">
          <div className="user-dash-section">
            <h3>
              <button className="dash-heading-btn" onClick={() => navigate('/check-in-out')}>
                Books to check-in ({checkedOutBooks.length})
              </button>
            </h3>
            <ul>
              {checkedOutBooks.map(checkedOutBook => {
                const book = allBooks.find(book => book.id === checkedOutBook.book_id);
                return (
                  <li className= "user-dash-list" key={checkedOutBook.id}>{book ? book.title : "Unknown"}</li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* Reserved Books */}
        <div className="grid-item">
          <div className="user-dash-section">
            <h3>Reserved books count: {reservedBooks.length}</h3>
            <ul>
              {reservedBooks.map(book => (
                <li className= "user-dash-list" key={book.id}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Read Books */}
        <div className="grid-item">
          <div className="user-dash-section">
            <h3>Books read so far ({readBooks.length})</h3>
            <ul>
              {readBooks.map(book => (
                <li className= "user-dash-list" key={book.id}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Favorite Books */}
        <div className="grid-item">
          <div className="user-dash-section">
          <h3>Favorite books count: {favoriteBooks.length}</h3>
            {favoriteBooks.map(favorite => {
                const book = allBooks.find(book => book.id === favorite.book_id);
                if (book) {
                return (
                  <div className='fav-books-align'>
                    <li className= "user-dash-list" key={book.id}>
                    {book.title}
                    <button className="unfavorite-button" onClick={() => handleFavoriteToggle(book.id, true)}>Unfavorite</button>
                    </li>
                  </div>
                );
                } else {
                return null; // Skip rendering if book is not found
                }
            })}
          </div>
        </div>
      </div>
      {/* Navigation Buttons */}
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
