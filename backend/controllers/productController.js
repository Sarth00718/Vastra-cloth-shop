import uploadOnCloudinary from "../config/cloudinary.js";
import { Product } from "../models/productModel.js";

//add product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const image1 = await uploadOnCloudinary(req.files.image1[0].path)
        const image2 = await uploadOnCloudinary(req.files.image2[0].path)
        const image3 = await uploadOnCloudinary(req.files.image3[0].path)
        const image4 = await uploadOnCloudinary(req.files.image4[0].path)

        let productData = {
            name: name,
            description: description,
            price: Number(price),
            category: category,
            subCategory: subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? "true" : "false",
            image1: image1,
            image2: image2,
            image3: image3,
            image4: image4,
            date: Date.now()
        }
        const product = await Product.create(productData)
        res.status(201).json({ message: "Product Added Successfully", product })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Add Product Error" })
    }
}

//list product
export const listProduct = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ products })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "List Product Error" })
    }
}

//remove product
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Remove Product Error" });
    }
}