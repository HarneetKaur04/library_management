import React from 'react';

const Profile = (props) => {
  let user = props.user;

  return (
    <div>
      <div className='user_profile'>
        <div className="user_img">
          <img src="https://static6.depositphotos.com/1010340/585/v/600/depositphotos_5859083-stock-illustration-panda-cartoon.jpg"
            alt="Profile"
          />
        </div>
        <div className="user_details">
          <h2>First Name: {user.given_name}</h2>
          <h2>Last Name: {user.family_name}</h2>
          <h2>Email: {user.email}</h2>
        </div>
      </div>
    </div>
  );
};

export default Profile;