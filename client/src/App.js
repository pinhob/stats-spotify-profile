import { useEffect, useState } from 'react';
import './App.css';
import { accessToken, logout } from './spotify';

function App() {
  const [token, getToken] = useState(null);

  useEffect(() => {
    getToken(accessToken);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {
          !token
            ? (
              <a
                className="App-link"
                href="http://localhost:8888/login"
              >
                Log in to Spotify
              </a>
            )
            : (
              <main>
                <h1>Logged in!</h1>
                <button onClick={logout}>Log Out</button>
              </main>
            )
        }
      </header>
    </div>
  );
}

export default App;
