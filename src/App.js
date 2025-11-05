import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './styles/App.scss';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      // Check if access_token is in URL (after Spotify login)
      const BACKEND_URI = process.env.REACT_APP_BACKEND_URI || 'http://127.0.0.1:5000';
      const urlParams = new URLSearchParams(window.location.search);
      let access_token = urlParams.get('access_token');

      // If no token in URL, fetch from backend (for returning users)
      if (!access_token) {
        try {
          const response = await fetch(`${BACKEND_URI}/auth/token`);
          const json = await response.json();
          access_token = json.access_token;
        } catch (err) {
          console.error('Failed to fetch token from backend', err);
        }
      }

      // If we got a token, set state and clean URL
      if (access_token) {
        setToken(access_token);
        window.history.replaceState({}, document.title, '/');
      }
    }

    getToken();
  }, []);

  // If we have a token, show WebPlayback; else show Login button
  return token ? <WebPlayback token={token} /> : <Login />;
}

export default App;
