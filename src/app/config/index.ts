import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface Config {
  port: string | number;
  database_url: string;
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
  jwt_secret: string;
  base_url: string;
  node_env: string;
}

const config: Config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL || 'mongodb://localhost:27017/campaign-db',
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  },
  jwt_secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
  base_url: process.env.BASE_URL || 'http://localhost:5000',
  node_env: process.env.NODE_ENV || 'development',
};

// Validate Cloudinary config
if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
  console.warn(
    '⚠️ Cloudinary environment variables are missing. Image upload may not work properly.',
  );
}

export default config;
