import dotenv from "dotenv";
import app from "./app";
import connectDB from "./db";

dotenv.config();

// একটি অ্যাসিঙ্ক্রোনাস ফাংশন যা সার্ভার শুরু করবে
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to connect to the database and start the server:",   
      error
    );
    process.exit(1);
  }
};

// সার্ভার শুরু করার জন্য ফাংশনটি কল করা
startServer();

// Vercel serverless export
export default app;
