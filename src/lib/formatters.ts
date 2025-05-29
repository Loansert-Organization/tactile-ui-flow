
/**
 * Formats a monetary amount with thousands separators
 * @param amount - The numeric amount to format
 * @returns Formatted string with thousands separators (e.g., "1,000")
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-RW').format(amount);
}

/**
 * Formats a monetary amount with currency prefix
 * @param amount - The numeric amount to format
 * @returns Formatted string with RWF prefix and thousands separators
 */
export function formatCurrency(amount: number): string {
  return `RWF ${formatAmount(amount)}`;
}
