import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="cineniche-header">
      <div className="header-left">
        <Link to="/" className="logo">CineNiche</Link>
      </div>
      <div className="header-right">
        <Link to="/login" className="nav-login-tab">Login</Link>
      </div>
    </header>
  );
};

export default Header;
