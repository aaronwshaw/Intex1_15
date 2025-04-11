// Header.tsx
import { Link } from 'react-router-dom';
import styles from '../../styles/Header.module.css';

function Header() {

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
        <button className={styles.navButton}>
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
        </button>
      </div>
    </nav>
  );
}

export default Header;
