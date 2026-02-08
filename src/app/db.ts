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

const connectDB = async () => {
  // যদি already connected থাকে
  if (globalAny._mongo.conn) {
    console.log('Using existing MongoDB connection');
    return globalAny._mongo.conn;
  }

  try {
    if (!globalAny._mongo.promise) {
      const opts = {
        bufferCommands: true, // ⚠️ এটা true করুন Vercel এর জন্য
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      };

      globalAny._mongo.promise = mongoose.connect(config.database_url, opts);
    }

    globalAny._mongo.conn = await globalAny._mongo.promise;
    console.log('✅ MongoDB connected successfully!');
    return globalAny._mongo.conn;
  } catch (error) {
    globalAny._mongo.promise = null;
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB;
