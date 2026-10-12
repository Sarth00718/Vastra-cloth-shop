import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 
import dotenv from 'dotenv';

dotenv.config();

const safeUnlink = (p) => {
    try {
        if (p && fs.existsSync(p)) {
            fs.unlinkSync(p);
        }
    } catch (e) {
        console.warn(`Could not unlink temp file ${p}:`, e.message);
    }
};

const uploadOnCloudinary = async (filePath) => {
    if (!filePath) {
        return null;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    try {
        const upload = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
        safeUnlink(filePath);
        return upload.secure_url;
    } catch (error) {
        safeUnlink(filePath);
        console.error("Cloudinary upload error:", error.message);
        return null;
    }
};

export default uploadOnCloudinary;