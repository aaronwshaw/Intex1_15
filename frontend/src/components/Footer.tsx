import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../styles/Footer.css'; // Adjust the path as necessary

const Footer: React.FC = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <Link to="/privacy" className="footer-link">
          Privacy Policy
        </Link>
        &emsp;
        <span className="footer-text">
          &copy; {new Date().getFullYear()} CineNiche.&emsp;All rights reserved.
        </span>
        &emsp;
        <a href="#" className="footer-icon" aria-label="Facebook">
          <FaFacebookF size={20} />
        </a>
        &emsp;
        <a href="#" className="footer-icon" aria-label="Instagram">
          <FaInstagram size={20} />
        </a>
        &emsp;
        <a href="#" className="footer-icon" aria-label="Twitter">
          <FaTwitter size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
