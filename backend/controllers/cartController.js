import { User } from "../models/userModel.js";

//add to cart
export const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let cartData = await user.cartData || {};
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await User.findByIdAndUpdate(req.userId, { cartData });
        res.json({ message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//update cart
export const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let cartData = user.cartData || {};

        // Initialize item if it doesn't exist
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (quantity === 0) {
            // Remove size from item
            delete cartData[itemId][size];

            // If no sizes left, remove the item entirely
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            // Set or update quantity
            cartData[itemId][size] = quantity;
        }

        await User.findByIdAndUpdate(req.userId, { cartData });
        res.json({ message: "Cart updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//getcartuser
export const getCartUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let cartData = await user.cartData || {};
        res.status(200).json(cartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}