import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="cineniche-header">
      <div className="header-left">
        <Link to="/" className="logo">CineNiche</Link>
      </div>
      <div className="header-right">
        <button className="login-button" onClick={handleLoginClick}>
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
