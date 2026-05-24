import { Subscription } from '../models/subscriptionModel.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return sendError(res, 'Email is required', 400);
    }

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
        return sendError(res, 'You are already subscribed!', 400);
    }

    const newSubscription = await Subscription.create({ email });

    return sendSuccess(res, { subscription: newSubscription }, 'Thank you for subscribing!', 201);
});
