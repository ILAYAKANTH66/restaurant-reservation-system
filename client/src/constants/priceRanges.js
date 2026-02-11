export const priceRangeOptions = [
  { value: '\u20B9', label: '\u20B9 - Budget' },
  { value: '\u20B9\u20B9', label: '\u20B9\u20B9 - Moderate' },
  { value: '\u20B9\u20B9\u20B9', label: '\u20B9\u20B9\u20B9 - Premium' },
  { value: '\u20B9\u20B9\u20B9\u20B9', label: '\u20B9\u20B9\u20B9\u20B9 - Luxury' },
];

export const getPriceRangeLabel = (value) => {
  const option = priceRangeOptions.find((item) => item.value === value);
  return option ? option.label : value || 'N/A';
};

