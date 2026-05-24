import { User } from "../models/userModel.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Self-healing: Ensure admin role for configured admin email
    if (user.email === process.env.ADMIN_EMAIL && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }

    return res.status(200).json(user);
});