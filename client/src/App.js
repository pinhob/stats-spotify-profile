import { useEffect, useState } from 'react';
import './App.css';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';

function App() {
  const [token, getToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    }

    catchErrors(fetchData());
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
                <button onClick={logout}>Log Out</button>
                { profile && (
                  <div>
                    <h1>{ profile.display_name }</h1>
                    <p>{ `${ profile.followers.total } followers` }</p>
                    {profile.images.length && profile.images[0].url && (
                      <img src={profile.images[0].url} alt="Avatar"/>
                    )}
                  </div>
                ) }
              </main>
            )
        }
      </header>
    </div>
  );
}

export default App;
