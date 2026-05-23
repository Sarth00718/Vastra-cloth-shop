import { User } from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { genToken, genToken1 } from '../config/token.js';

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required', success: false });
        }

        const normalizedName = String(name).trim();
        const normalizedEmail = String(email).trim().toLowerCase();

        if (normalizedName.length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters', success: false });
        }

        //user exist
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        //validate email
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ message: 'Invalid email', success: false });
        }

        if (String(password).length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user
        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        res.json({ message: 'User created successfully', success: true, user, token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //all fields are required
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password", success: false });
        }
        //generate token
        let token = await genToken(user._id);

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 90 * 24 * 60 * 60 * 1000,// 1 day in milliseconds
            sameSite: 'None' // Prevent CSRF attacks
        }).json({
            user,
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        return res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;

        //check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            //create new user
            user = await User.create({
                name,
                email
            })
        }

        //generate token
        let token = await genToken(user._id);

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 90 * 24 * 60 * 60 * 1000,// 1 day in milliseconds
            secure: true,
            sameSite: 'None'
        }).json({
            user, token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

//admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            let token = await genToken1(email);
            return res.status(200).cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,//
                sameSite: 'None' // Prevent CSRF attacks
            }).json({ message: "Admin logged in successfully", token });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
