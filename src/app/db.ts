import mongoose from 'mongoose';
import config from './config';

declare global {
  var _mongo: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalAny: any = global;

if (!globalAny._mongo) {
  globalAny._mongo = { conn: null, promise: null };
}

const connectDB = async (retries = 5, delay = 5000) => {
  if (globalAny._mongo.conn) return globalAny._mongo.conn;

  while (retries > 0) {
    try {
      if (!globalAny._mongo.promise) {
        globalAny._mongo.promise = mongoose.connect(config.database_url, {
          bufferCommands: false,
          connectTimeoutMS: 60000,
          serverSelectionTimeoutMS: 60000,
          socketTimeoutMS: 45000,
        });
      }

      globalAny._mongo.conn = await globalAny._mongo.promise;
      console.log('✅ MongoDB connected successfully!');
      return globalAny._mongo.conn;
    } catch (error) {
      console.error(`Failed to connect to MongoDB. Retries left: ${retries}`);
      retries--;
      if (retries === 0) {
        throw error;
      }
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; //Exponential Backoff
    }
  }
};

export default connectDB;
