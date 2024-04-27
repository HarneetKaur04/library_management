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
  const [message, setMessage] = useState('') 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await fetch('http://localhost:5000/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setMessage('Book added successfully!')
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  };

  return (
    <div className="add-book">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <label><strong>Title:</strong></label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        
        <label><strong>Author:</strong></label>
        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        
        <label><strong>ISBN:</strong></label>
        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        
        <label><strong>Publication Date:</strong></label>
        <input type="date" name="publication_date" value={formData.publication_date} onChange={handleChange} required />
        
        <label><strong>Genre:</strong></label>
        <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        
        <button type="submit">Add Book</button>
      </form>
      <p className='add-book-message'>{message}</p>
    </div>
  );
}

export default AddBook;
