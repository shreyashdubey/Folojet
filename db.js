// server/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongodbURI = 'mongodb+srv://shreyashlrn:Aqtv5LKHqRAPKDZm@cluster0.cbrrnq0.mongodb.net/';
    await mongoose.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
