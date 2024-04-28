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
        <label htmlFor="title"><strong>Title:</strong></label>
        <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required />
        
        <label htmlFor="author"><strong>Author:</strong></label>
        <input id="author" type="text" name="author" value={formData.author} onChange={handleChange} required />
        
        <label htmlFor="isbn"><strong>ISBN:</strong></label>
        <input id="isbn" type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        
        <label htmlFor="publication_date"><strong>Publication Date:</strong></label>
        <input id="publication_date" type="date" name="publication_date" value={formData.publication_date} onChange={handleChange} required />
        
        <label htmlFor="genre"><strong>Genre:</strong></label>
        <input id="genre" type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        
        <button type="submit">Add Book</button>
      </form>
      <p className='add-book-message'>{message}</p>
    </div>
  );
}

export default AddBook;
