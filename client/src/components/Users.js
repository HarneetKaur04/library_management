import React, { useState, useEffect } from 'react';
import './User.css'; // Import CSS file

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // State to track the editing status
  const [editedUser, setEditedUser] = useState(null); // State to store edited user data

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
    return () => {};
  }, []);

  // Function to delete a user by ID
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle editing user
  const handleEditUser = (userId) => {
    // Find the user to edit by userId
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      // Set the edited user data
      setEditedUser(userToEdit);
      // Set the editing status to true
      setIsEditing(userId);
    }
  };

  // Function to save edited user data
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      if (!response.ok) {
        throw new Error('Failed to save edited user');
      }
      // Update the user list with the edited user data
      setUsers(users.map(user => (user.id === editedUser.id ? editedUser : user)));
      // Reset editing status and edited user data
      setIsEditing(null);
      setEditedUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle input change for edited user data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the edited user data with the new value
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='user'>
      <h2>LIST OF ALL USERS</h2>
      <ul className="user-list">
      {users
      .filter(user => user.email !== 'admin@test.com')
      .map(user => (
        <li key={user.id} className="user-item">
          {isEditing === user.id ? (
            // Render input fields for editing if user is being edited
            <>
              <input
                type="text"
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="text"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="input-field"
              />
              <button onClick={handleSaveEdit} className="action-button edit-button">Save</button>
            </>
          ) : (
            // Render user details if user is not being edited
            <>
              <p><strong>USERNAME:</strong> {user.username}, <strong>EMAIL:</strong> {user.email}</p>
              <button onClick={() => handleEditUser(user.id)} className="action-button edit-button">Edit</button>
              <button onClick={() => handleDeleteUser(user.id)} className="action-button delete-button">Delete</button>
            </>
          )}
        </li>
      ))}
      </ul>
    </div>
  );
};

export default User;
