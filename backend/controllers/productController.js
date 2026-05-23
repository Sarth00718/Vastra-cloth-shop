import uploadOnCloudinary from '../config/cloudinary.js';
import { Product } from '../models/productModel.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js';

// ─── ADD PRODUCT ──────────────────────────────────────────────────────────────
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

  if (!req.files?.image1?.[0] || !req.files?.image2?.[0] || !req.files?.image3?.[0] || !req.files?.image4?.[0]) {
    return sendError(res, 'All 4 product images are required', 400);
  }

  const [image1, image2, image3, image4] = await Promise.all([
    uploadOnCloudinary(req.files.image1[0].path),
    uploadOnCloudinary(req.files.image2[0].path),
    uploadOnCloudinary(req.files.image3[0].path),
    uploadOnCloudinary(req.files.image4[0].path),
  ]);

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category,
    subCategory,
    sizes: JSON.parse(sizes),
    bestseller: bestseller === 'true' || bestseller === true,
    image1,
    image2,
    image3,
    image4,
    date: Date.now(),
  });

  return sendSuccess(res, { product }, 'Product added successfully', 201);
});

// ─── LIST PRODUCTS (with optional search, filter, sort, pagination) ───────────
export const listProduct = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    category,
    subCategory,
    search,
    sort = 'date_desc',
    bestseller,
  } = req.query;

  const query = {};

  if (category) query.category = { $in: category.split(',') };
  if (subCategory) query.subCategory = { $in: subCategory.split(',') };
  if (bestseller === 'true') query.bestseller = true;
  if (search) query.$text = { $search: search };

  const sortMap = {
    date_desc: { date: -1 },
    date_asc: { date: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
  };
  const sortQuery = sortMap[sort] || { date: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(query),
  ]);

  return sendPaginated(res, products, total, page, limit);
});

// ─── SINGLE PRODUCT ───────────────────────────────────────────────────────────
export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return sendError(res, 'Product not found', 404);
  return sendSuccess(res, { product });
});

// ─── REMOVE PRODUCT ───────────────────────────────────────────────────────────
export const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return sendError(res, 'Product not found', 404);
  return sendSuccess(res, {}, 'Product removed successfully');
});

// ─── REMOVE ALL PRODUCTS ──────────────────────────────────────────────────────
export const removeAllProducts = asyncHandler(async (req, res) => {
  const result = await Product.deleteMany({});
  return sendSuccess(res, { deletedCount: result.deletedCount }, 'All products removed');
});

// ─── UPDATE PRODUCT ───────────────────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.price = Number(price);
  if (category) updateData.category = category;
  if (subCategory) updateData.subCategory = subCategory;
  if (sizes) updateData.sizes = JSON.parse(sizes);
  if (bestseller !== undefined) updateData.bestseller = bestseller === 'true' || bestseller === true;

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!product) return sendError(res, 'Product not found', 404);
  return sendSuccess(res, { product }, 'Product updated successfully');
});
