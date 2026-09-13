import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

/**
 * Create in-app notification + emit via Socket.io + optional email
 */
export const createNotification = async ({
  receiver,
  sender,
  type,
  title,
  message,
  linkUrl,
  io,
}) => {
  // 1. Save to DB
  const notification = await Notification.create({
    receiver,
    sender,
    type,
    title,
    message,
    linkUrl,
  });

  // 2. Emit via Socket.io to user's personal room
  if (io) {
    io.to(`user_${receiver}`).emit('new_notification', {
      _id: notification._id,
      title,
      message,
      type,
      linkUrl,
      read: false,
      createdAt: notification.createdAt,
    });
  }

  // 3. Send email for critical events
  const emailEvents = ['proposal_accepted', 'payment_completed', 'escrow_released', 'contract_created'];
  if (emailEvents.includes(type)) {
    try {
      const recipientUser = await User.findById(receiver).select('email name').lean();
      if (recipientUser) {
        await sendEmail({
          to: recipientUser.email,
          subject: `Workstation: ${title}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Workstation</h1>
              </div>
              <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #0F172A; margin-top: 0;">${title}</h2>
                <p style="color: #475569; line-height: 1.6;">${message}</p>
                ${linkUrl ? `<a href="${process.env.CLIENT_URL || 'http://localhost:3256'}${linkUrl}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Details</a>` : ''}
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Notification email failed:', emailErr.message);
    }
  }

  return notification;
};
