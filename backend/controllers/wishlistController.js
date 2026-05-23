import { User } from '../models/userModel.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ─── GET WISHLIST ─────────────────────────────────────────────────────────────
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('wishlist').lean();
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, { wishlist: user.wishlist || [] });
});

// ─── TOGGLE WISHLIST ──────────────────────────────────────────────────────────
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return sendError(res, 'productId is required', 400);

  const user = await User.findById(req.userId);
  if (!user) return sendError(res, 'User not found', 404);

  const wishlist = user.wishlist || [];
  const idx = wishlist.indexOf(productId);
  const added = idx === -1;

  if (added) {
    wishlist.push(productId);
  } else {
    wishlist.splice(idx, 1);
  }

  user.wishlist = wishlist;
  await user.save();

  return sendSuccess(res, { wishlist, added }, added ? 'Added to wishlist' : 'Removed from wishlist');
});
