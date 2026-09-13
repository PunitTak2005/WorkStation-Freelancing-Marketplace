import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

/**
 * Create a Razorpay order for escrow deposit
 * @param {number} amount - Amount in INR (smallest currency unit: paise)
 * @param {string} contractId - Contract ID for reference
 * @param {number} milestoneIndex - Milestone index
 * @returns {Object} Razorpay order object
 */
export const createOrder = async (amount, contractId, milestoneIndex) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `ws_${contractId}_ms${milestoneIndex}_${Date.now()}`,
    notes: {
      contractId: String(contractId),
      milestoneIndex: String(milestoneIndex),
      platform: 'Workstation',
    },
  };
  const order = await razorpay.orders.create(options);
  return order;
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpay_signature;
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPaymentDetails = async (paymentId) => {
  return await razorpay.payments.fetch(paymentId);
};
