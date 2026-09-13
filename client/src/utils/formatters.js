import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Formats a numeric currency value into compact Indian notation:
 * - K (Thousand)
 * - L (Lakh)
 * - Cr (Crore)
 * Rounds to at most one decimal place and removes trailing '.0'.
 * Example: 12450 -> '₹12.5K', 85999 -> '₹86K', 1245678 -> '₹12.5L', 12345678 -> '₹1.2Cr'
 */
export const formatCompactINR = (amount) => {
  const val = Number(amount) || 0;
  const isNegative = val < 0;
  const abs = Math.abs(val);

  let formatted = '';
  if (abs >= 10000000) { // 1 Crore = 10,000,000
    const cr = Math.round((abs / 10000000) * 10) / 10;
    formatted = (cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)) + 'Cr';
  } else if (abs >= 100000) { // 1 Lakh = 100,000
    const l = Math.round((abs / 100000) * 10) / 10;
    formatted = (l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)) + 'L';
  } else if (abs >= 1000) { // 1 Thousand = 1,000
    const k = Math.round((abs / 1000) * 10) / 10;
    formatted = (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
  } else {
    formatted = Math.round(abs).toString();
  }

  return (isNegative ? '-₹' : '₹') + formatted;
};

export const formatCompactCurrency = (amount, currency = 'INR') => {
  if (currency === 'INR') {
    return formatCompactINR(amount);
  }
  return formatCurrency(amount, currency);
};

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');
export const formatDateTime = (date) => format(new Date(date), 'MMM dd, yyyy hh:mm a');
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str;
