import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { genToken } from '../config/token.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Helper function to format clean user object without sensitive data
 */
const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProviders: user.authProviders || [],
    cartData: user.cartData || {},
    wishlist: user.wishlist || []
});

/**
 * Standard cookie configuration for authentication
 */
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedName.length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }

    if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (String(password).length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        // If registered via Google without a password, allow setting a password
        if (!existingUser.password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
            if (!existingUser.authProviders.includes('credentials')) {
                existingUser.authProviders.push('credentials');
            }
            await existingUser.save();
            const token = await genToken(existingUser._id);
            return res.cookie("token", token, getCookieOptions()).json({
                success: true,
                message: 'Password set successfully! You can now login with your email and password.',
                user: sanitizeUser(existingUser),
                token
            });
        }
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (normalizedEmail === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        authProviders: ['credentials'],
        role
    });

    const token = await genToken(user._id);

    res.cookie("token", token, getCookieOptions());
    return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        user: sanitizeUser(user),
        token
    });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.password) {
        return res.status(400).json({
            success: false,
            message: "This account was created via Google Sign-In. Please sign in with Google or register a password."
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Ensure admin role for configured admin email
    if (normalizedEmail === process.env.ADMIN_EMAIL && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }

    const token = await genToken(user._id);

    return res.cookie("token", token, getCookieOptions()).status(200).json({
        success: true,
        message: "Login successful!",
        user: sanitizeUser(user),
        token
    });
});

/**
 * @desc    Logout user & clear cookie
 * @route   GET /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

/**
 * @desc    Google Sign-In / Sign-Up
 * @route   POST /api/auth/googlelogin
 */
export const googleLogin = asyncHandler(async (req, res) => {
    const { name, email, googleId } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required for Google Sign-In" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        const role = (normalizedEmail === process.env.ADMIN_EMAIL) ? 'admin' : 'user';
        user = await User.create({
            name: name || 'Google User',
            email: normalizedEmail,
            googleId,
            authProviders: ['google'],
            role
        });
    } else {
        let updated = false;
        if (!user.googleId && googleId) {
            user.googleId = googleId;
            updated = true;
        }
        if (!user.authProviders) {
            user.authProviders = ['google'];
            updated = true;
        } else if (!user.authProviders.includes('google')) {
            user.authProviders.push('google');
            updated = true;
        }
        if (normalizedEmail === process.env.ADMIN_EMAIL && user.role !== 'admin') {
            user.role = 'admin';
            updated = true;
        }
        if (updated) await user.save();
    }

    const token = await genToken(user._id);

    return res.cookie("token", token, getCookieOptions()).status(200).json({
        success: true,
        message: "Google login successful!",
        user: sanitizeUser(user),
        token
    });
});

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.email === process.env.ADMIN_EMAIL && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }

    return res.status(200).json({
        success: true,
        user: sanitizeUser(user)
    });
});
