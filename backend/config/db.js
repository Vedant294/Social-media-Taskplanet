import mongoose from 'mongoose';

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, err.message);
      if (retries === MAX_RETRIES) process.exit(1);
      await new Promise(r => setTimeout(r, 2000 * retries));
    }
  }
};

export default connectDB;
