import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, opts);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // More descriptive error messages
    if (error.code === 'ETIMEOUT') {
      throw new Error('Connection timed out. Please check your network connection and MongoDB URI.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('MongoDB host not found. Please check your MongoDB URI.');
    } else if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    } else {
      throw error;
    }
  }
}; 