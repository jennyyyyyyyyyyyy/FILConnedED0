const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use Render's assigned port or default to 5000 locally

// Long-lived access token stored in an environment variable
const accessToken = process.env.DROPBOX_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Long-lived access token is missing. Please set DROPBOX_ACCESS_TOKEN in your environment variables.");
  process.exit(1);
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the FILConnectED API!",
    endpoints: {
      test: "GET /test - Test Dropbox API integration",
    },
  });
});

// Test Dropbox API
app.get("/test", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.dropboxapi.com/2/files/list_folder",
      { path: "" }, // Root folder
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Dropbox API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to call Dropbox API." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
