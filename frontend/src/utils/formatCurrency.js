/**
 * Formats a numeric value into Indian Rupees (INR) format (e.g., ₹19,999.00)
 */
export const formatINR = (amount) => {
  const num = parseFloat(amount || 0);
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
