    import mongoose from "mongoose";
    import { DB_NAME } from "../constants.js";

    const connectDB = async () => {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in backend/.env");
        }

        if (process.env.MONGODB_URI.includes("<db_password>")) {
            throw new Error("Replace <db_password> in backend/.env with your real MongoDB Atlas password");
        }

        try {
            const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
                dbName: DB_NAME,
            });

            console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
            console.log(`Database: ${connectionInstance.connection.name}`);
        } catch (error) {
            if (error?.message?.toLowerCase().includes("bad auth")) {
                throw new Error(
                    "MongoDB Atlas authentication failed. Verify DB user/password in Atlas Database Access and URL-encode special characters in password."
                );
            }

            throw error;
        }
    };

    export default connectDB;