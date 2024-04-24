import React, { useState } from 'react';
import './AddBook.css'; // Import CSS file for styling

function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publication_date: '',
    genre: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      setSuccessMessage('Book added successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding book:', error.message);
      setErrorMessage(error.message || 'Error adding book');
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-book">
      <h2>Add New Book</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        
        <label>Author:</label>
        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        
        <label>ISBN:</label>
        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        
        <label>Publication Date:</label>
        <input type="date" name="publication_date" value={formData.publication_date} onChange={handleChange} required />
        
        <label>Genre:</label>
        <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
