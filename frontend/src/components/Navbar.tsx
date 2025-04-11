import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/IntexAPI';
import { useContext } from 'react';
import { UserContext } from './AuthorizeView';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.ok) {
      navigate('/'); // 👈 redirects to landing page
    } else {
      alert('Logout failed. Try again.');
    }
  };

  const isAdmin = user?.roles.includes('Admin');

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
        <div className={styles.navLinks}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
          &emsp;
          <Link to="/search" className={styles.navLink}>
            Search
          </Link>
          &emsp;
          {/* ✅ Only show if Admin */}
          {isAdmin && (
            <>
              <Link to="/admin" className={styles.navLink}>
                Admin
              </Link>
              &emsp;
            </>
          )}
        </div>

        <div className={styles.userInfo}>Logged in as: {user?.email}</div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
