import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 
import dotenv from 'dotenv';

dotenv.config();

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    if(!filePath){
        return null;
    }
    try {
        const upload = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return upload.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.error(error)
    }
}

export default uploadOnCloudinary;