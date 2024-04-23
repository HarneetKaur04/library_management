import React from 'react';
import AuthNav from './Auth0/auth-nav';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Loading from "./Auth0/loading";
import './Navbar.css'; // Import CSS file

const Navbar = () => {

  const { isLoading, user } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="top">
      <div className="topLeft">
        <Link className="homeLink" to="/">
          LMS
        </Link>
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/books">
              ALL BOOKS
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/myparks">
              ADD BOOKS
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/contact">
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      <div className="topRight">
        {user && (
          <>
            <Link className="link" to="/me">
              <img
                className="topImgRight"
                src="https://static6.depositphotos.com/1010340/585/v/600/depositphotos_5859083-stock-illustration-panda-cartoon.jpg"
                alt="Happy panda facing front"
              />
            </Link>
            <span>Hello {user.name}</span>
          </>
        )}

        {!user && (
          <>
            <li className="topListItem">
              <Link className="link" to="/login">
                <AuthNav />
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/signup">
                SIGN UP
              </Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
