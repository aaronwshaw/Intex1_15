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
      navigate('/');
    } else {
      alert('Logout failed. Try again.');
    }
  };

  // Check if user is an admin
  const isAdmin = user?.roles.includes('Admin');

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>CineNiche</div>

      <div className={styles.navRight}>
        <div className={styles.navLinks}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
          <Link to="/search" className={styles.navLink}>
            Search
          </Link>

          {/* ✅ Only show Admin if user has Admin role */}
          {isAdmin && (
            <Link to="/admin" className={styles.navLink}>
              Admin
            </Link>
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
