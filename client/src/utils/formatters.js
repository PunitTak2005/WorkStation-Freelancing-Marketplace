import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');
export const formatDateTime = (date) => format(new Date(date), 'MMM dd, yyyy hh:mm a');
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str;
