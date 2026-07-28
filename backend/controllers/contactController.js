import { sendContactEmails } from '../utils/sendEmail.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import validator from 'validator';

/**
 * POST /api/contact/send
 * Processes contact form submission and dispatches emails via Nodemailer
 */
export const sendContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return sendError(res, 'Please provide your full name', 400);
    }

    if (!email || !validator.isEmail(email)) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    if (!subject || !subject.trim()) {
      return sendError(res, 'Please provide a subject for your inquiry', 400);
    }

    if (!message || !message.trim()) {
      return sendError(res, 'Please enter your message', 400);
    }

    if (message.trim().length < 10) {
      return sendError(res, 'Message must be at least 10 characters long', 400);
    }

    // Send emails via Nodemailer utility
    await sendContactEmails({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
    });

    return sendSuccess(
      res,
      {},
      'Your message has been sent successfully! We will get back to you shortly.',
      200
    );
  } catch (error) {
    console.error('Error in sendContactForm controller:', error);
    return sendError(res, error.message || 'Failed to send your message. Please try again later.', 500);
  }
};
