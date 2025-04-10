import { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookieAccepted');
    if (!hasAccepted) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="cookie-popup">
      <p>
        This website uses cookies to improve your experience. By continuing, you
        accept our use of cookies.
      </p>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
};

export default CookieConsent;
