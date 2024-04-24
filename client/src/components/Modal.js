import React, { useState } from 'react';
import './Modal.css'; // Import CSS file for styling

function Modal({ bookInfo, onClose, onSave }) {
  const [updatedBookInfo, setUpdatedBookInfo] = useState({ ...bookInfo });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBookInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const closeModal = () => {
    onClose(); // Close the modal
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${updatedBookInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBookInfo)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedBook = await response.json();
      onSave(updatedBook); // Pass the updated book information back to the parent component
      closeModal(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating book:', error);
      setErrorMessage('Failed to update book. Please try again later.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Book</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <label>Title:</label>
          <input type="text" name="title" value={updatedBookInfo.title} onChange={handleChange} />
          <label>Author:</label>
          <input type="text" name="author" value={updatedBookInfo.author} onChange={handleChange} />
          <label>ISBN:</label>
          <input type="text" name="isbn" value={updatedBookInfo.isbn} onChange={handleChange} />
          <label>Genre:</label>
          <input type="text" name="genre" value={updatedBookInfo.genre} onChange={handleChange} />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
