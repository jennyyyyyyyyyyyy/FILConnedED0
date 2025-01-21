const express = require("express");
const axios = require("axios");
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch'); // Required for Node.js

const app = express();
const port = process.env.PORT || 5000;
	@@ -35,19 +33,6 @@ app.get("/oauth2redirect", async (req, res) => {
    // Log the access token received from Dropbox
    console.log("Access Token received:", accessToken);

    // Initialize Dropbox client with the access token
    const dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });

    // Retrieve and log the user's account information, including permissions
    dbx.usersGetCurrentAccount()
      .then((accountInfo) => {
        console.log('User  Account Info:', accountInfo);
        console.log('Permissions:', accountInfo.scopes); // Log the permissions
      })
      .catch((error) => {
        console.error('Error retrieving account info:', error);
      });

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
