require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const stateKey = 'spotify_auth_state';

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));


app.get('/', (_req, res) => res.send(`Hello World!`));

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
  ].join(' ');


  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    scope
  }).toString();

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', async (req, res) => {
  try {
    const code = req.query.code || null;

    const requestOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    }

    const { status, data: { access_token, refresh_token, expires_in } } = await axios(requestOptions);

    if (status === 200) {
      const queryParams = new URLSearchParams({
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
      }).toString();

      res.redirect(`${FRONTEND_URI}?${queryParams}`);
    } else {
      res.redirect(`/?${new URLSearchParams({ error: 'invalid_token' }).toString()}`);
    }
  } catch (error) {
    res.send(error);
  }
});

app.get('/refresh_token', async (req, res) => {
  try {
    const { refresh_token } = req.query;

    const requestOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      }
    }

    const { data } = await axios(requestOptions);

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
