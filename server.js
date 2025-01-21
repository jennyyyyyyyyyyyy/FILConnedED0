const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.get("/oauth2redirect", async (req, res) => {
  // Get the authorization code from Dropbox's redirect URL
  const code = req.query.code;

  // If no authorization code is found in the URL, return an error
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token", // Dropbox's token endpoint
      null,
      {
        params: {
          code: code,
          grant_type: "authorization_code",
          client_id: process.env.DROPBOX_CLIENT_ID, // Your Dropbox app client ID
          client_secret: process.env.DROPBOX_CLIENT_SECRET, // Your Dropbox app client secret
          redirect_uri: process.env.DROPBOX_REDIRECT_URI, // The same redirect URI you provided to Dropbox
        },
      }
    );

    // Extract the access token from the response data
    const accessToken = response.data.access_token;

    // Send the access token back to the app as JSON
    res.status(200).json({ access_token: accessToken });
  } catch (error) {
    // Handle any errors (e.g., network issues, invalid code, etc.)
    console.error("Error exchanging code for access token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for access token." });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${process.env.PORT || "http://localhost:5000"}`);
});
