import { User } from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error fetching user:", error.message);
        return res.status(500).json({ message: "Error fetching user" });
    }
};

//get admin
export const getAdmin = async (req, res) => {
    try {
        let adminEmail = req.adminEmail;
        if (!adminEmail) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(201).json({
            message: "Admin found",
            email: adminEmail,
            role: "admin"
        })
    } catch (error) {
        console.log("Error fetching admin:", error.message);
        return res.status(500).json({ message: "Error fetching admin" });
    }
};