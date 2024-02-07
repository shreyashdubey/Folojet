const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/UserSchema");
const { getAccessToken } = require("../services/fedExService");
router.get("/get-access-token", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      res.status(200).json({ access_token: accessToken });
    } else {
      res.status(500).json({ error: "Failed to get access token--" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

// Route to call FedEx API
router.post("/track-shipment", async (req, res) => {
  const { trackingNumbers } = req.body;

  if (
    !trackingNumbers ||
    !Array.isArray(trackingNumbers) ||
    trackingNumbers.length === 0
  ) {
    res
      .status(400)
      .json({ error: "Invalid or missing tracking numbers in the request" });
    return;
  }

  try {
    // Get a fresh access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      res.status(500).json({ error: "Failed to get access token" });
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const requestBody = {
      trackingInfo: trackingNumbers.map((trackingNumber) => ({
        trackingNumberInfo: {
          trackingNumber: trackingNumber,
        },
      })),
      includeDetailedScans: true,
    };

    // Make the API request
    const response = await axios.post(
      "https://apis-sandbox.fedex.com/track/v1/trackingnumbers",
      requestBody,
      { headers }
    );

    // Process the response from FedEx API
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error while calling FedEx API:", error.message);
    res.status(500).json({ error: "Failed to call FedEx API" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
