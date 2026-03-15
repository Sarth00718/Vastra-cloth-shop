import { User } from "../models/userModel.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ wishlist: user.wishlist || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Toggle product in wishlist (add if not present, remove if present)
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const wishlist = user.wishlist || [];
        const index = wishlist.indexOf(productId);

        let added;
        if (index === -1) {
            // Add to wishlist
            wishlist.push(productId);
            added = true;
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
            added = false;
        }

        user.wishlist = wishlist;
        await user.save();

        res.status(200).json({
            message: added ? "Added to wishlist" : "Removed from wishlist",
            wishlist,
            added,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
