import { useState, useEffect } from "react";
import { getCurrentUserProfile, getCurrentUserPlaylists } from "../spotify";
import { catchErrors } from "../utils";
import { StyledHeader } from "../style";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      const profile = await getCurrentUserProfile();
      setProfile(profile.data);

      const playlists = await getCurrentUserPlaylists();
      setPlaylists(playlists.data);
    }

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {
        profile && (
          <>
            <StyledHeader type="user">
              <div className="header__inner">
                {profile.images.length && profile.images[0].url && (
                  <img className="header__img" src={profile.images[0].url} alt="Avatar" />
                )}
                <div>
                  <div className="header__overline">Profile</div>
                  <h1 className="header__name">{profile.display_name}</h1>
                  <p className="header__meta">
                    <span>
                      {profile.followers.total} Follower{profile.followers.total !== 1 ? 's' : ''}
                    </span>
                    {playlists && (
                      <span>{playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}</span>
                    )}
                  </p>
                </div>
              </div>
            </StyledHeader>
          </>
        )
      }
    </>
  )
}

export default Profile;