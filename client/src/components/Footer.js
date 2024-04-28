import React from 'react';
import './Footer.css'; // Import CSS file for styling

const Footer = () => {
  return (
    <div className="footerCenter">
      <ul className="footer">
        <li className="social_media">
          <a href="https://www.linkedin.com/in/harneet123/" target="_blank" data-testid="linkedin-link">
            <i className="topIcon fa-brands fa-linkedin"></i>
          </a>
        </li>
        <li className="social_media">
          <a href="https://github.com/HarneetKaur04" target="_blank" data-testid="github-link">
            <i className="topIcon fa-brands fa-github"></i>
          </a>
        </li>
      </ul>
      <div>Copyright © 2024 Harneet Kaur</div>
    </div>
  );
};

export default Footer;
