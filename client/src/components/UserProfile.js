import React, { useState } from 'react';
import { useUser } from '../UserContext';
import './UserProfile.css';

function UserProfile () {
  const { user } = useUser(); // useUser hook to get user data
  const [editedUser, setEditedUser] = useState({
    username: user.username,
    email: user.email,
    contact_details: user.contact_details // Initialize contact details with user's existing data
  }); // State to manage edited user data
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  // Function to handle input change for edited user data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to save edited user data
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      if (!response.ok) {
        throw new Error('Failed to save edited user');
      }
      
      // Update user state with edited data
      const updatedUser = { ...user, ...editedUser };
      // Update user data
      setEditedUser(updatedUser)
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div>
      <div className='user_profile'>
        <div className="user_img">
          <img src="https://static6.depositphotos.com/1010340/585/v/600/depositphotos_5859083-stock-illustration-panda-cartoon.jpg"
            alt="Profile"
          />
        </div>
        <div className="user_details">
          {isEditing ? (
            <>
              <input
                type="text"
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
              />
              <input
                type="contact_details"
                name="contact_details"
                value={editedUser.contact_details}
                onChange={handleInputChange}
              />
              <button className="edit-user-btn" onClick={handleSaveEdit}>Save</button>
            </>
          ) : (
            <>
              <p><strong>USERNAME:</strong> {editedUser.username}</p>
              <p><strong>EMAIL:</strong> {editedUser.email}</p>
              <p><strong>PHONE:</strong> {editedUser.contact_details}</p>
              <button className="edit-user-btn" onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
