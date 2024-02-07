// server/db.js
const mongoose = require("mongoose");
const dbURL = process.env.DEV_DB_URL;
const connectDB = async () => {
  try {
    const mongodbURI = dbURL;
    await mongoose.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
