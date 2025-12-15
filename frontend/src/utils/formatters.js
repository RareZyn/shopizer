import dayjs from 'dayjs';

// Format price with currency
export const formatPrice = (price, currency = 'USD') => {
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  }
  return price;
};

// Format date
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

// Format date relative (e.g., "2 hours ago")
export const formatDateRelative = (date) => {
  return dayjs(date).fromNow();
};
