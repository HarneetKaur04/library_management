import React, { useState, useEffect } from 'react';
import './Books.css'; // Import CSS file for styling
import BookDetails from './BookDetails'; // Import BookDetails component
import Modal from './Modal'; // Import Modal component
import { useUser } from '../UserContext';
import { useAdminStatus } from '../AdminStatusContext';

function Books() {
  const { user } = useUser(); // Use the useUser hook to get user data
  const { isAdmin } = useAdminStatus();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('title'); // Default filter
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [editBookInfo, setEditBookInfo] = useState(null); // State to store book info for editing
  const [selectedSorting, setSelectedSorting] = useState('title'); // State to store selected sorting option

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
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleBookClick = (book) => {
    setSelectedBook(book); // Set the selected book id
    setIsModalOpen(false);
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

  const sortingOptions = {
    title: { label: 'Title A-Z', compare: (a, b) => a.title.localeCompare(b.title) },
    author: { label: 'Author A-Z', compare: (a, b) => a.author.localeCompare(b.author) },
    year: { label: 'Book Year', compare: (a, b) => {
      const yearA = new Date(a.publication_date).getFullYear();
      const yearB = new Date(b.publication_date).getFullYear();
      return yearA - yearB;
    }}  
  };

  const handleSortingChange = (event) => {
    const sortingOption = event.target.value;
    setSelectedSorting(sortingOption);
  };

  const renderSortingOptions = () => (
    <select value={selectedSorting} onChange={handleSortingChange}>
      {Object.entries(sortingOptions).map(([key, value]) => (
        <option key={key} value={key}>{value.label}</option>
      ))}
    </select>
  );

  const filterBooksByAlphabet = (alphabet) => {
    setSelectedAlphabet(alphabet === selectedAlphabet ? null : alphabet); // Toggle selection
    setSearchQuery(''); // Reset search query
    setSelectedBook(null);
    setSelectedGenre('');
    setSelectedAuthor('');
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Clear alphabet filter when user starts typing in the search input
    setSelectedAlphabet(null);
    setSelectedGenre('');
    setSelectedAuthor('');
  };

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setSelectedFilter(filter);
    setSearchQuery(''); // Clear search query when changing filter
    setSelectedAlphabet(null);
    setSelectedGenre('');
    setSelectedAuthor('');
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
        <button onClick={() => filterBooksByAlphabet(null)}>All</button> {/* Button to clear alphabet filter */}
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

  // Sort filtered books based on the selected sorting option
  filteredBooks.sort(sortingOptions[selectedSorting].compare);

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setEditBookInfo(null);
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
          <div className="sorting-section">
            <h2>Sort by:</h2>
            {renderSortingOptions()}
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
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <li className="book-list" key={book.id} onClick={() => handleBookClick(book)}>
                  {book.title}
                  {/* used stopPropagation as edit button was calling both handleEditBook and handleBookClick leading to modal not opening */}
                  {user && isAdmin? (
                    <>
                      <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditBook(book.id); }}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                    </>
                  ) : null}
                </li>
              ))
            ) : (
              <h4>No book available as per your search criteria.</h4>
            )}
          </ul>
        </div>
        <div className="book-details">
          {selectedBook && !isModalOpen && <BookDetails book={selectedBook}/>} {/* Render BookDetails if a book is selected */}
        </div>
      </div>
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
