const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.get("/oauth2redirect", async (req, res) => {
  const code = req.query.code;  // Get the authorization code from query params

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
          client_id: process.env.DROPBOX_CLIENT_ID,
          client_secret: process.env.DROPBOX_CLIENT_SECRET,
          redirect_uri: process.env.DROPBOX_REDIRECT_URI,  // Your redirect URI
        },
      }
    );

    // Extract the access token from Dropbox's response
    const accessToken = response.data.access_token;

    // Log the access token received from Dropbox
    console.log("Access Token received:", accessToken);

    // Redirect to the mobile app with the access token
    const redirectUri = `filconnected://oauth2redirect?access_token=${accessToken}`; // Use your custom scheme
    res.redirect(redirectUri); // Redirect to the custom URL scheme
  } catch (error) {
    console.error("Error exchanging code for access token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for access token." });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${process.env.PORT || "http://localhost:5000"}`);
});
