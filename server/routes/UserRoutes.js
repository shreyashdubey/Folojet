const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema'); // Adjust the path accordingly

// Create a new user
router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user instance
    const newUser = new User({ firstName, lastName, email });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({success: true, data: savedUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Update user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

// Get user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
