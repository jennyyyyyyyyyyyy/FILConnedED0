const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

// Log the environment variables to check if they're set
console.log("Dropbox Client ID:", process.env.DROPBOX_CLIENT_ID);
console.log("Dropbox Client Secret:", process.env.DROPBOX_CLIENT_SECRET);
console.log("Dropbox Redirect URI:", process.env.DROPBOX_REDIRECT_URI);

// Endpoint to serve the OAuth Redirect URI
app.get("/oauth2redirect", async (req, res) => {
  const code = req.query.code;

  // Log the authorization code to ensure it's received
  console.log("Authorization code:", code);

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
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
          client_id: process.env.DROPBOX_CLIENT_ID,
          client_secret: process.env.DROPBOX_CLIENT_SECRET,
          redirect_uri: process.env.DROPBOX_REDIRECT_URI,
        },
      }
    );

    // Log the response data from Dropbox to check if the token was returned successfully
    console.log("Token response:", response.data);

    // Get the access token from the response
    const accessToken = response.data.access_token;

    // Redirect the user back to the app with the access token in the query parameter
    res.redirect(`filconneded://oauth2redirect?access_token=${accessToken}`);
  } catch (error) {
    console.error("Error exchanging code for access token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for access token." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on ${process.env.PORT || "http://localhost:5000"}`);
});
