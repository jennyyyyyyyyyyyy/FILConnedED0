const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Ensure you have dotenv to load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Endpoint to handle the OAuth2 redirect
app.get("/oauth2redirect", async (req, res) => {
  const code = req.query.code; // Get the authorization code from query params

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange the code for an access token from Dropbox
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      null,
      {
        params: {
          code: code,
          grant_type: "authorization_code",
          client_id: process.env.DROPBOX_CLIENT_ID, // Set these variables in your .env file
          client_secret: process.env.DROPBOX_CLIENT_SECRET,
          redirect_uri: process.env.DROPBOX_REDIRECT_URI, // Your redirect URI
        },
      }
    );

    // Extract the access token from Dropbox's response
    const accessToken = response.data.access_token;

    // Send the access token to the Android app
    res.status(200).json({
      access_token: accessToken,
    });
  } catch (error) {
    console.error("Error exchanging code for access token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for access token." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on ${process.env.PORT || "http://localhost:5000"}`);
});
