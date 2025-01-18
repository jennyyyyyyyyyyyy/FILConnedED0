const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000; // Use Render's PORT or fallback to 5000

// Endpoint to serve the OAuth Redirect URI
app.get("/oauth2redirect", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code missing.");
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      null,
      {
        params: {
          code: code,
          grant_type: "authorization_code",
          client_id: process.env.DROPBOX_CLIENT_ID, // Use Render environment variable
          client_secret: process.env.DROPBOX_CLIENT_SECRET, // Use Render environment variable
          redirect_uri: process.env.DROPBOX_REDIRECT_URI, // Use Render environment variable
        },
      }
    );

    // Send the access token back as a response
    const accessToken = response.data.access_token;
    res.status(200).send(`Access Token: ${accessToken}`);
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to exchange code for access token.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on ${process.env.PORT || 'http://localhost:5000'}`);
});
