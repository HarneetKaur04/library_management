import React, { useState, useEffect } from 'react';
import './Books.css'; // Import CSS file for styling
import BookDetails from './BookDetails'; // Import BookDetails component
import Modal from './Modal'; // Import Modal component
import { useUser } from '../UserContext';

function Books() {
  const { user } = useUser(); // Use the useUser hook to get user data
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the current image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [editBookInfo, setEditBookInfo] = useState(null); // State to store book info for editing

  const images = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.webp',
    '/assets/image4.webp',
    '/assets/image5.jpg'
  ];

  useEffect(() => {
    // Fetch books data from API
    fetch('http://localhost:5000/api/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data); // Set books data to state
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });

    // Set up interval to change images every 2 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 4000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId); // Set the selected book id
    setIsModalOpen(false); // Close modal when a book is selected
  };

  const handleEditBook = (bookId) => {
    // Find the selected book by bookId
    const selectedBookInfo = books.find(book => book.id === bookId);
    if (selectedBookInfo) {
      // Set the selected book info for editing
      setEditBookInfo(selectedBookInfo);
      // Open the modal for editing
      setIsModalOpen(true);
    }
  };

  const handleSave = (updatedBookInfo) => {
    // Update the book list with the updated book information
    setBooks(prevBooks =>
      prevBooks.map(book => (book.id === updatedBookInfo.id ? updatedBookInfo : book))
    );
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Remove the deleted book from the books list
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      // Reset selected book and details
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const filterBooksByAlphabet = (alphabet) => {
    setSelectedAlphabet(alphabet === selectedAlphabet ? null : alphabet); // Toggle selection
    setSearchQuery(''); // Reset search query
    setSelectedBook(null); // Reset selected book
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear alphabet filter when user starts typing in the search input
    setSelectedAlphabet(null);
  };

  // Filter books based on search query
  const filteredBooks = selectedAlphabet
    ? books.filter(book => book.title.toLowerCase().startsWith(selectedAlphabet.toLowerCase()))
    : books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setEditBookInfo(null); // Clear edit book info
  };

  return (
    <div className="page-container">
      <div className="background-image" style={{ backgroundImage: `url(${images[currentImageIndex]})` }} />
      <div className="content-container">
        <div className="alphabet-filter">
          <h2>Filter by Title</h2>
          {[...Array(26)].map((_, index) => (
            <button key={index} onClick={() => filterBooksByAlphabet(String.fromCharCode(65 + index))}>
              {String.fromCharCode(65 + index)}
            </button>
          ))}
        </div>
        <div className="search-filter">
          <h2>Search guide</h2>
          <input
            type="text"
            placeholder="Search by title, author, is, or genre"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="all-books">
          <h2>List of books</h2>
          <ul>
          {filteredBooks.map(book => (
            <li key={book.id} onClick={() => handleBookClick(book.id)}>
              {book.title}
              {/* used stopPropagatio as edit button was calling both handleEditBook and handleBookClick leading to modal not opening */}
              {user ? (
              <>
                <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditBook(book.id); }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </>
            ) : null}
            </li>
          ))}
          </ul>
        </div>
        <div className="book-details">
          {selectedBook && !isModalOpen && <BookDetails bookId={selectedBook} />} {/* Render BookDetails if a book is selected */}
        </div>
      </div>
      {/* Render modal only if modal is open */}
      {isModalOpen && editBookInfo && (
        <Modal
          bookInfo={editBookInfo}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Books;
