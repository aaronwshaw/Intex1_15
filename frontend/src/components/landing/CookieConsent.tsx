import { useEffect, useState } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [animateHide, setAnimateHide] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    document.cookie = 'userSetting=largerText; path=/'; // set browser-accessible cookie
    setAnimateHide(true);
    setTimeout(() => setShow(false), 300);
  };

  //if (!show) return null;

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
