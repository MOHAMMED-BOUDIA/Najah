const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;
  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
