import React, { useState, useEffect } from 'react';
import './Books.css'; // Import CSS file for styling
import { useUser } from '../UserContext';
import { useAdminStatus } from '../AdminStatusContext';
import { useNavigate } from 'react-router-dom';

function BookDetails({ book }) {
  const { user } = useUser(); // Use the useUser hook to get user data
  const { isAdmin } = useAdminStatus();
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();

  const fetchFavoriteStatus = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if the current book is favorited by the user
        const isFavorited = data.favoriteBooks.some(favoriteBook => favoriteBook.book_id === book.id);
        setFavorited(isFavorited);
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteStatus();
  }, [user, book]); // Re-fetch favorite status when user or book changes

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login')
    }
    try {
      if (user) {
        const url = `http://localhost:5000/api/users/${user.id}/favorite-books/${book.id}`;
        const method = favorited ? 'DELETE' : 'POST';
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: book.id }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setFavorited(!favorited); // Toggle the favorited state locally
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="book-details-container">
      <h2>Title: {book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year Published:</strong> {book.publication_date}</p>
      <div className='book-details-btn'>
        {!isAdmin && (
          <button className={`favorite-btn ${favorited ? 'favorited' : ''}`} onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        )}
        <button className="check-in-out-btn" onClick={() => navigate('/check-in-out')}>Check In/Check Out</button>
        <button className="check-in-out-btn" onClick={() => navigate('/reserve-books')}>Reserve</button>
      </div>
    </div>
  );
}

export default BookDetails;
