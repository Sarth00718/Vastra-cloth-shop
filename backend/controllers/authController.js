import { User } from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { genToken } from '../config/token.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
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
        // If user registered via Google but hasn't set a password yet
        if (!existingUser.password) {
            if (String(password).length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
            if (!existingUser.authProviders.includes('credentials')) {
                existingUser.authProviders.push('credentials');
            }
            await existingUser.save();
            const token = await genToken(existingUser._id);
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({ message: 'Password set successfully. You can now login with email.', success: true, user: existingUser, token });
        }
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
    
    // Check if this is the admin email
    const role = (normalizedEmail === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

    //create user
    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        authProviders: ['credentials'],
        role
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.json({ message: 'User created successfully', success: true, user, token });
});

export const login = asyncHandler(async (req, res) => {
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

    // Check if user has a password. If not, they probably registered via Google.
    // We will allow them to log in if they provide a password, but first we need to handle the case where password is null.
    if (!user.password) {
        return res.status(400).json({
            message: "This account was created via Google. To login with password, please set a password in your profile or use Google Login.",
            success: false
        });
    }

    //compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password", success: false });
    }

    // Self-healing: Ensure admin role for configured admin email
    if (email === process.env.ADMIN_EMAIL && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }

    //generate token
    let token = await genToken(user._id);

    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 90 * 24 * 60 * 60 * 1000,// 1 day in milliseconds
        sameSite: 'None' // Prevent CSRF attacks
    }).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cartData: user.cartData,
            wishlist: user.wishlist
        },
        token
    });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
    return res.status(200).json({ message: "Logged out successfully", success: true });
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { name, email, googleId } = req.body;

    //check if user exists
    let user = await User.findOne({ email });
    if (!user) {
        // Check if this is the admin email
        const role = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

        //create new user
        user = await User.create({
            name,
            email,
            googleId,
            authProviders: ['google'],
            role
        })
    } else {
        // If user exists, link Google ID and add to providers
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
        if (!user.name && name) {
            user.name = name;
            updated = true;
        }
        
        // If it's the admin email, ensure role is admin
        if (email === process.env.ADMIN_EMAIL && user.role !== 'admin') {
            user.role = 'admin';
            updated = true;
        }

        if (updated) await user.save();
    }

    //generate token
    let token = await genToken(user._id);

    return res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: 90 * 24 * 60 * 60 * 1000,// 1 day in milliseconds
        secure: true,
        sameSite: 'None'
    }).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cartData: user.cartData,
            wishlist: user.wishlist
        }, 
        token
    });
});
