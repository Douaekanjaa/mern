// config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
