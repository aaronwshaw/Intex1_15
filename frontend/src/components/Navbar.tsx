// Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/IntexAPI';
import { AuthorizedUser } from './AuthorizeView';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.ok) {
      navigate('/login');
    } else {
      alert('Logout failed. Try again.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>MovieApp</div>

      <div className={styles.navCenter}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/search" className={styles.navLink}>
          Search
        </Link>
      </div>

      <div className={styles.navRight}>
        <span>
          Logged in as: <AuthorizedUser value="email" />
        </span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
