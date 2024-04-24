import React from 'react';
import { useUser } from '../UserContext';
import './User.css';

function UserProfile () {
  const { user } = useUser(); // useUser hook to get user data

  return (
    <div>
      <div className='user_profile'>
        <div className="user_img">
          <img src="https://static6.depositphotos.com/1010340/585/v/600/depositphotos_5859083-stock-illustration-panda-cartoon.jpg"
            alt="Profile"
          />
        </div>
        <div className="user_details">
          <p><strong>USERNAME:</strong> {user.username}</p>
          <p><strong>EMAIL:</strong> {user.email}</p>
          <p><strong>MEMBER SINCE:</strong> {user.created_at}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;