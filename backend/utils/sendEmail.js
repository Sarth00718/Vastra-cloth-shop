import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter based on ENV vars.
 * If SMTP credentials are missing, uses Ethereal test account or safe logging mode.
 */
/**
 * Creates and returns a Nodemailer transporter.
 * If SMTP_USER & SMTP_PASS exist in process.env, uses those credentials.
 * If missing, automatically generates an Ethereal test account so emails are ACTUALLY sent over the network
 * and a clickable web preview URL (e.g. ethereal.email/message/...) is printed in the server log.
 */
const getTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && user.trim() && pass && pass.trim()) {
    if (host.includes('gmail')) {
      return {
        transporter: nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: user.trim(),
            pass: pass.trim(),
          },
        }),
        isEthereal: false,
      };
    }

    return {
      transporter: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: user.trim(),
          pass: pass.trim(),
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      isEthereal: false,
    };
  }

  // Create an ethereal test account automatically
  const testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return {
    transporter: testTransporter,
    isEthereal: true,
  };
};

/**
 * Send Contact Form Emails (Admin Notification + User Confirmation)
 */
export const sendContactEmails = async ({ name, email, phone, subject, message }) => {
  const { transporter, isEthereal } = await getTransporter();
  const adminEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'admin@vastra.com';
  const senderEmail = isEthereal ? 'no-reply@vastra.com' : (process.env.SMTP_USER || 'no-reply@vastra.com');

  // 1. Notification Email to Admin/Store Owner
  const adminMailOptions = {
    from: `"Vastra Contact Desk" <${senderEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `📩 New Contact Inquiry: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-top: 0;">
          New Customer Inquiry - Vastra
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 120px;">Customer Name:</td>
            <td style="color: #f1f5f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Email:</td>
            <td style="color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Phone:</td>
            <td style="color: #f1f5f9;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Subject:</td>
            <td style="color: #f1f5f9;">${subject}</td>
          </tr>
        </table>
        <div style="background-color: #1e293b; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 6px; margin-top: 16px;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">Message Content:</p>
          <p style="margin-top: 8px; color: #f8fafc; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #64748b;">This inquiry was sent from Vastra Contact Us page.</p>
      </div>
    `,
  };

  // 2. Acknowledgement Email to Customer
  const userMailOptions = {
    from: `"Vastra Customer Support" <${senderEmail}>`,
    to: email,
    subject: `We received your message: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #38bdf8; margin-top: 0;">Thank You for Reaching Out, ${name}!</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">
          We have received your message regarding <strong>"${subject}"</strong>. Our support team is reviewing your inquiry and will get back to you within 24 business hours.
        </p>
        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
          <h4 style="margin-top: 0; color: #f1f5f9;">Your Message Summary:</h4>
          <p style="color: #94a3b8; font-style: italic; line-height: 1.5;">"${message}"</p>
        </div>
        <p style="color: #cbd5e1;">If you have any urgent requests, please contact our helpline directly at <strong>+91-7046053000</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Vastra Clothing. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const adminResult = await transporter.sendMail(adminMailOptions);
    const userResult = await transporter.sendMail(userMailOptions);

    if (isEthereal) {
      console.log('\n=================== ✉️ EMAIL DISPATCHED (TEST MODE) ===================');
      console.log('🔗 Admin Email Web Preview:', nodemailer.getTestMessageUrl(adminResult));
      console.log('🔗 User Confirmation Web Preview:', nodemailer.getTestMessageUrl(userResult));
      console.log('========================================================================\n');
    } else {
      console.log('✅ Real emails dispatched successfully via SMTP to:', adminEmail, 'and', email);
    }

    return { adminResult, userResult };
  } catch (err) {
    console.error('❌ [Nodemailer SMTP Error]:', err.message);
    throw err;
  }
};
