
import { formatAmount, formatCurrency } from '../formatters';

describe('formatters', () => {
  describe('formatAmount', () => {
    it('should format numbers with thousands separators', () => {
      expect(formatAmount(1000)).toBe('1,000');
      expect(formatAmount(10000)).toBe('10,000');
      expect(formatAmount(100000)).toBe('100,000');
      expect(formatAmount(1000000)).toBe('1,000,000');
    });

    it('should handle small numbers without separators', () => {
      expect(formatAmount(100)).toBe('100');
      expect(formatAmount(999)).toBe('999');
    });

    it('should handle zero', () => {
      expect(formatAmount(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with RWF prefix and thousands separators', () => {
      expect(formatCurrency(1000)).toBe('RWF 1,000');
      expect(formatCurrency(50000)).toBe('RWF 50,000');
      expect(formatCurrency(325000)).toBe('RWF 325,000');
    });

    it('should handle zero currency', () => {
      expect(formatCurrency(0)).toBe('RWF 0');
    });
  });
});
