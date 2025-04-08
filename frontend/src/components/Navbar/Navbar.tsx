// inside Navbar.tsx
import "./Navigation.css"; // ✅ correct

// src/components/Navbar/Navbar.tsx
export default function Navbar() {
  return (
    <nav id="cs-navigation">
      <div className="cs-container">
        <a href="/" className="cs-logo">
          <img src="/logo.png" alt="Site Logo" />
        </a>

        <button className="cs-toggle" onClick={() => {
          document.getElementById('cs-navigation')?.classList.toggle('cs-active');
          document.body.classList.toggle('cs-open');
        }}>
          <div className="cs-box">
            <span className="cs-line cs-line1" />
            <span className="cs-line cs-line2" />
            <span className="cs-line cs-line3" />
          </div>
        </button>

        <div className="cs-ul-wrapper">
          <ul className="cs-ul">
            <li className="cs-li"><a href="/" className="cs-li-link">Home</a></li>
            <li className="cs-li"><a href="/movies" className="cs-li-link">Movies</a></li>
            <li className="cs-li"><a href="/login" className="cs-li-link">Login</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
