require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3000;

// OAuth2 endpoints
const DROPBOX_AUTH_URL = 'https://www.dropbox.com/oauth2/authorize';
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

// Redirect URI
const REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI;
const CLIENT_ID = process.env.DROPBOX_APP_KEY;
const CLIENT_SECRET = process.env.DROPBOX_APP_SECRET;

// Step 1: Redirect to Dropbox for authorization
app.get('/auth', (req, res) => {
  const authUrl = `${DROPBOX_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Step 2: Handle OAuth2 redirect and exchange authorization code for access token
app.get('/oauth2redirect', async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send('Missing authorization code.');
  }

  try {
    // Step 3: Exchange authorization code for access token
    const response = await axios.post(DROPBOX_TOKEN_URL, querystring.stringify({
      code: authorizationCode,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }));

    const { access_token, expires_in } = response.data;

    // Step 4: Send access token back to the client (you can store it or redirect)
    // For simplicity, we're redirecting back to the app with the access token in the query string
    res.redirect(`filconnected://oauth2redirect?access_token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error.response?.data || error.message);
    res.status(500).send('Error exchanging authorization code.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
