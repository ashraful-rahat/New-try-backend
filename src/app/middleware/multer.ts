import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Validate Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Cloudinary connection failed:', error.message);
    } else {
      console.error('❌ Cloudinary connection failed:', error);
    }

    console.warn('Images will be stored locally instead');
  }
};

testCloudinaryConnection();

// Cloudinary storage configuration
const campaignStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'campaigns',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      public_id: `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  },
});

// File filter
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, WebP, GIF) আপলোড করা যাবে'));
  }
};

// Multer instances
export const campaignUpload = multer({
  storage: campaignStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Maximum 10 files
  },
});

export const singleUpload = multer({
  storage: campaignStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Helper function to get image URL from Cloudinary response
export const getCloudinaryImageData = (file: Express.Multer.File) => {
  // Cloudinary returns file.path as the URL
  const url = file.path;
  const publicId = file.filename;

  return {
    url: url,
    publicId: publicId,
  };
};

// Export cloudinary instance
export { cloudinary };
