const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema'); 
const  { getAccessToken } = require('../services/fedxService')
const axios = require('axios');
router.get('/get-access-token', async (req, res) => {
  try {
        const accessToken = await getAccessToken();
        if (accessToken) {
            res.status(200).json({ access_token: accessToken });
        } else {
            res.status(500).json({ error: 'Failed to get access token--' });
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: 'Failed to get access token' });
    }
});


// Route to call FedEx API
router.post('/track-shipment', async (req, res) => {
  try {
    // Get a fresh access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      res.status(500).json({ error: 'Failed to get access token' });
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: '794843185271', // Replace with your actual tracking number
          },
        },
      ],
      includeDetailedScans: true,
    };

    // Make the API request
    const response = await axios.post('https://apis-sandbox.fedex.com/track/v1/trackingnumbers', requestBody, { headers });

    // Process the response from FedEx API
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error while calling FedEx API:', error.message);
    res.status(500).json({ error: 'Failed to call FedEx API' });
  }
});

module.exports = router;

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
