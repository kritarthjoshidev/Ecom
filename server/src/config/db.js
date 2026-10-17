import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

  try {
    // Attempt connection with a short timeout so offline starts don't hang
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MongoDB Connection Notice: Could not connect to MongoDB at "${uri}".\x1b[0m`);
    console.warn(`\x1b[36mℹ Active Fallback: Running in In-Memory Demo Mode so you can test all features right away without waiting for MongoDB Atlas!\x1b[0m`);
    console.warn(`\x1b[36mℹ When ready, add your MongoDB Atlas URI in server/.env to persist data.\x1b[0m`);
    return false;
  }
};

export const getIsConnected = () => isConnected;
export const setIsConnected = (val) => { isConnected = val; };
