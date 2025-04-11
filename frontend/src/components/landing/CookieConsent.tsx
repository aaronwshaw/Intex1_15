import { useEffect, useState } from 'react';
import './CookieConsent.css';

// Helper to read a cookie by name
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [animateHide, setAnimateHide] = useState(false);

  useEffect(() => {
    const hasAccepted = getCookie('userSetting') === 'accepted';
    if (!hasAccepted) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    document.cookie = 'userSetting=accepted; path=/; max-age=31536000'; // 1 year
    setAnimateHide(true);
    setTimeout(() => setShow(false), 300);
  };

  if (!show) return null;

  return (
    <div className={`cookie-banner ${animateHide ? 'hidden' : ''}`}>
      <p>
        This website uses cookies to improve your experience. By using this
        site, you agree to our cookie policy.
      </p>
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
};

export default CookieConsent;
