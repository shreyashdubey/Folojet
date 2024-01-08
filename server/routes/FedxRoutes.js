const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema'); 
const  { getAccessToken } = require('../services/fedxService')
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
