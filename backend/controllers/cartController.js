import { User } from '../models/userModel.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ─── ADD TO CART ──────────────────────────────────────────────────────────────
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, size } = req.body;
  if (!itemId || !size) return sendError(res, 'itemId and size are required', 400);

  const user = await User.findById(req.userId);
  if (!user) return sendError(res, 'User not found', 404);

  const cartData = user.cartData || {};
  if (!cartData[itemId]) cartData[itemId] = {};
  cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

  await User.findByIdAndUpdate(req.userId, { cartData });
  return sendSuccess(res, { cartData }, 'Item added to cart');
});

// ─── UPDATE CART ──────────────────────────────────────────────────────────────
export const updateCart = asyncHandler(async (req, res) => {
  const { itemId, size, quantity } = req.body;
  if (!itemId || !size || quantity === undefined) {
    return sendError(res, 'itemId, size and quantity are required', 400);
  }

  const user = await User.findById(req.userId);
  if (!user) return sendError(res, 'User not found', 404);

  const cartData = user.cartData || {};
  if (!cartData[itemId]) cartData[itemId] = {};

  if (quantity <= 0) {
    delete cartData[itemId][size];
    if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
  } else {
    cartData[itemId][size] = quantity;
  }

  await User.findByIdAndUpdate(req.userId, { cartData });
  return sendSuccess(res, { cartData }, 'Cart updated');
});

// ─── GET CART ─────────────────────────────────────────────────────────────────
export const getCartUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('cartData').lean();
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, { cartData: user.cartData || {} });
});
