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
  const [selectedFilter, setSelectedFilter] = useState('title'); // Default filter
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [editBookInfo, setEditBookInfo] = useState(null); // State to store book info for editing

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data); // Set books data to state
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    // Fetch books data from API
    fetchBooks();

    // Fetch favorite books if user is logged in
    if (user) {
      fetchFavoriteBooks();
    }
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const fetchFavoriteBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Update the favorited status of books based on user's favorite list
      setBooks(prevBooks =>
        prevBooks.map(book => ({
          ...book,
          favorited: data.favoriteBooks.some(favoriteBook => favoriteBook.book_id === book.id)
        }))
      );
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    }
  };

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

  const handleFavoriteToggle = async (bookId, favorited) => {
    try {
      if (favorited) {
        // If book is already favorited, send a DELETE request to remove it
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books/${bookId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } else {
        // If book is not favorited, send a POST request to add it
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/favorite-books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }
      // Update the favorited status locally
      setBooks(prevBooks =>
        prevBooks.map(book => {
          if (book.id === bookId) {
            return { ...book, favorited: !favorited };
          }
          return book;
        })
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filterBooksByAlphabet = (alphabet) => {
    setSelectedAlphabet(alphabet === selectedAlphabet ? null : alphabet); // Toggle selection
    setSearchQuery(''); // Reset search query
    setSelectedBook(null); // Reset selected book
    setSelectedGenre(''); // Reset selected genre
    setSelectedAuthor(''); // Reset selected author
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Clear alphabet filter when user starts typing in the search input
    setSelectedAlphabet(null);
    setSelectedGenre(''); // Clear selected genre when searching
    setSelectedAuthor(''); // Clear selected author when searching
  };

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setSelectedFilter(filter);
    setSearchQuery(''); // Clear search query when changing filter
    setSelectedAlphabet(null); // Clear alphabet filter
    setSelectedGenre(''); // Clear genre filter
    setSelectedAuthor(''); // Clear author filter
  };

  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);

    // Clear alphabet filter and search query when selecting genre
    setSelectedAlphabet(null);
    setSearchQuery('');
    setSelectedAuthor(''); // Clear selected author when selecting genre
  };

  const handleAuthorChange = (event) => {
    const author = event.target.value;
    setSelectedAuthor(author);

    // Clear alphabet filter and search query when selecting author
    setSelectedAlphabet(null);
    setSearchQuery('');
    setSelectedGenre(''); // Clear selected genre when selecting author
  };

  const renderAlphabetButtons = () => {
    return (
      <div className="title-alphabets">
        {[...Array(26)].map((_, index) => (
          <button key={index} onClick={() => filterBooksByAlphabet(String.fromCharCode(65 + index))}>
            {String.fromCharCode(65 + index)}
          </button>
        ))}
      </div>
    );
  };

  const renderFilterOptions = () => {
    switch (selectedFilter) {
      case 'genre':
        const uniqueGenres = [...new Set(books.map(book => book.genre))];
        return (
          <select value={selectedGenre} onChange={handleGenreChange}>
            <option value="">All Genres</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        );
      case 'author':
        const uniqueAuthors = [...new Set(books.map(book => book.author))];
        return (
          <select value={selectedAuthor} onChange={handleAuthorChange}>
            <option value="">All Authors</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  // Filter books based on search query, alphabet, genre, and author
  const filteredBooks = books.filter(book => {
    const matchesSearchQuery =
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.isbn.toLowerCase().includes(searchQuery) ||
      book.genre.toLowerCase().includes(searchQuery);

    const matchesAlphabet = !selectedAlphabet || book.title.toLowerCase().startsWith(selectedAlphabet.toLowerCase());

    const matchesGenre = !selectedGenre || book.genre.toLowerCase() === selectedGenre.toLowerCase();

    const matchesAuthor = !selectedAuthor || book.author.toLowerCase() === selectedAuthor.toLowerCase();

    return matchesSearchQuery && matchesAlphabet && matchesGenre && matchesAuthor;
  });

  // Sort filtered books alphabetically by title
  filteredBooks.sort((a, b) => a.title.localeCompare(b.title));

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setEditBookInfo(null); // Clear edit book info
  };

  return (
    <div className="page-container">
      <div className="background-image" />
      <div className="content-container">
        <div className="filter-section">
          <div className="filter-by">
            <h2>Book Title:</h2>
            {renderAlphabetButtons()}
          </div>
          <div className="filter-by">
            <h2>Filter by:</h2>
            <select value={selectedFilter} onChange={handleFilterChange}>
              <option value="title">Select</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
            {renderFilterOptions()}
          </div>
        </div>
        <div className="search-filter">
          <h2>Search guide</h2>
          <input
            type="text"
            placeholder="Search by title, author, ISBN, or genre"
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
                {/* used stopPropagation as edit button was calling both handleEditBook and handleBookClick leading to modal not opening */}
                {user ? (
                  <>
                    <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditBook(book.id); }}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                  </>
                ) : null}
                {user && (
                  <button className="favorite-btn" onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(book.id, book.favorited); }}>
                    {book.favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="book-details">
          {selectedBook && !isModalOpen && <BookDetails bookId={selectedBook}/>} {/* Render BookDetails if a book is selected */}
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
