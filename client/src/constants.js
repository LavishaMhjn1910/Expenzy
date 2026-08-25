export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Other',
];

export const CATEGORY_COLORS = {
  Food: '#E3B23C',
  Transport: '#52B788',
  Housing: '#7CA982',
  Utilities: '#4C9F70',
  Health: '#C4593B',
  Entertainment: '#D98E4F',
  Shopping: '#8FBFA3',
  Education: '#6FA8DC',
  Travel: '#B98CD9',
  Other: '#9CAA9F',
};

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function formatMoney(amount, currency = 'INR') {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  const value = Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${value}`;
}
