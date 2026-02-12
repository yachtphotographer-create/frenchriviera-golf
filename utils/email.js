const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Send email
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return true;
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
    const verifyUrl = `${process.env.APP_URL}/auth/verify/${token}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1B5E20;">Welcome to French Riviera Golf!</h1>
            <p>Hi ${user.display_name},</p>
            <p>Thanks for registering. Please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}"
                   style="background-color: #1B5E20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Verify Email
                </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
            <p>This link expires in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">French Riviera Golf - Find your perfect golf partners on the Cote d'Azur</p>
        </div>
    `;
    return sendEmail(user.email, 'Verify your email - French Riviera Golf', html);
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password/${token}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1B5E20;">Reset Your Password</h1>
            <p>Hi ${user.display_name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #1B5E20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">French Riviera Golf - Find your perfect golf partners on the Cote d'Azur</p>
        </div>
    `;
    return sendEmail(user.email, 'Reset your password - French Riviera Golf', html);
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail
};
