import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatCompactCurrency = (amount, currency = 'INR') => {
  const val = Number(amount) || 0;
  // For small to medium amounts under 1 Lakh, use standard currency format
  if (Math.abs(val) < 100000) {
    return formatCurrency(val, currency);
  }
  // For larger amounts, provide compact notation using en-IN / compact notation
  try {
    const compact = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(val);
    return compact;
  } catch {
    return formatCurrency(val, currency);
  }
};

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');
export const formatDateTime = (date) => format(new Date(date), 'MMM dd, yyyy hh:mm a');
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str;
