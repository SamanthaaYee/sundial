import React, { useState, useEffect } from 'react';

const trackTemplate = {
  name: "",
  album: { images: [{ url: "" }] },
  artists: [{ name: "" }]
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(trackTemplate);
  const current_track_name = current_track.name;
  const current_artist_name = current_track.artists[0].name;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "sam's web playback.mp3",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);

        // Transfer playback to Web Playback SDK
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          body: JSON.stringify({ device_ids: [device_id], play: false }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        player.getCurrentState().then(s => setActive(!!s));
      });

      player.connect();
    };
  }, [token]);

  // Control buttons using the Web API to ensure they work
  const togglePlay = () => {
    fetch(`https://api.spotify.com/v1/me/player/${is_paused ? 'play' : 'pause'}?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => setPaused(!is_paused));
  };

  const nextTrack = () => {
    fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  const previousTrack = () => {
    fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  // Volume state
  const [volume, setVolume] = useState(0.5);

  // When player is ready, get initial volume
  useEffect(() => {
    if (!player) return;
    player.getVolume().then(vol => setVolume(vol));
  }, [player]);

  // Change volume (called by slider)
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    player.setVolume(newVolume).then(() => {
      console.log('Volume set to:', newVolume);
    });
  };

    return (
      <div className="container liquid-glass">
          <div className="content-wrapper">
          {!deviceId && <b>your music is loading...</b>}
          {deviceId && (
              <>
              <div className="cover-container">
                <img src={current_track.album.images[0].url} className={`now-playing__cover ${is_paused ? "" : "animation__spin"}`} alt="" />
                {/* <div class="hole"></div> */}
              </div>

              <div className="now-playing__side">
                  <div>
                      <div className="now-playing__name now-playing__text">{current_track_name}</div>
                      <div className="now-playing__artist now-playing__text">{current_artist_name}</div>
                  </div>
                  <div className="controls">
                      <button className="btn-spotify" onClick={previousTrack}>&lt;&lt;</button>
                      <button className="btn-spotify" onClick={togglePlay}>
                          {is_paused ? "play" : "pause"}
                      </button>
                      <button className="btn-spotify" onClick={nextTrack}>&gt;&gt;</button>
                  </div>
                  <input className="volume-control"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
              </div>
              </>
          )}
          </div>
      </div>
    );
}

export default WebPlayback;
