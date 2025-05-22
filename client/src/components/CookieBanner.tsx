import React, { useEffect, useState } from 'react';

const COOKIE_KEY = 'cookie_consent_accepted';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
      <div className="bg-gray-900 text-white rounded-t-lg shadow-lg p-4 m-2 max-w-xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm">
          This website uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies. See our{' '}
          <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
        </span>
        <button
          onClick={handleAccept}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors text-sm font-semibold"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner; 