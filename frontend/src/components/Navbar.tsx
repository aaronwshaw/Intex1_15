// Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/IntexAPI';
import { AuthorizedUser } from './AuthorizeView';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.ok) {
      navigate('/'); // 👈 redirects to landing page
    } else {
      alert('Logout failed. Try again.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.logoContainer}>
          <img
            src="/white-logo.png"
            alt="CineNiche Logo"
            className={styles.logoImage}
          />
        </Link>
      </div>

      <div className={styles.navRight}>
        {/* Page links shifted right */}
        <div className={styles.navLinks}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
          &emsp;
          <Link to="/search" className={styles.navLink}>
            Search
          </Link>
          &emsp;
          <Link to="/admin" className={styles.navLink}>
            Admin
          </Link>
          &emsp;
        </div>

        {/* Logged in user in its own box */}
        <div className={styles.userInfo}>
          Logged in as: <AuthorizedUser value="email" />
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
