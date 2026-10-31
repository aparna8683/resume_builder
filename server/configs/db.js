import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection warning:", err.message);
    // Do not call process.exit(1) to avoid killing dev server during transient network issues
  }
};

export default connectDB;
