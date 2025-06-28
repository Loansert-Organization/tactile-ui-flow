
import { formatAmount, formatCurrency } from './formatters';

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  numberFormat: string;
  dateFormat: string;
}

export const supportedLocales: Record<string, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    numberFormat: 'en-US',
    dateFormat: 'MM/dd/yyyy'
  },
  rw: {
    code: 'rw',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
    flag: '🇷🇼',
    numberFormat: 'en-RW',
    dateFormat: 'dd/MM/yyyy'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    numberFormat: 'fr-FR',
    dateFormat: 'dd/MM/yyyy'
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇹🇿',
    numberFormat: 'sw-TZ',
    dateFormat: 'dd/MM/yyyy'
  }
};

/**
 * Format amount with locale-aware number formatting
 */
export function formatAmountLocale(amount: number, locale: string = 'en'): string {
  const localeInfo = supportedLocales[locale] || supportedLocales.en;
  try {
    return new Intl.NumberFormat(localeInfo.numberFormat).format(amount);
  } catch {
    // Fallback to default formatting if locale is not supported
    return formatAmount(amount);
  }
}

/**
 * Format currency with locale-aware formatting
 */
export function formatCurrencyLocale(amount: number, locale: string = 'en'): string {
  return `RWF ${formatAmountLocale(amount, locale)}`;
}

/**
 * Format date with locale-aware formatting
 */
export function formatDateLocale(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeInfo = supportedLocales[locale] || supportedLocales.en;
  
  try {
    return new Intl.DateTimeFormat(localeInfo.numberFormat, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  } catch {
    // Fallback to ISO string if locale formatting fails
    return dateObj.toLocaleDateString();
  }
}

/**
 * Format datetime with locale-aware formatting
 */
export function formatDateTimeLocale(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeInfo = supportedLocales[locale] || supportedLocales.en;
  
  try {
    return new Intl.DateTimeFormat(localeInfo.numberFormat, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  } catch {
    // Fallback to locale string if locale formatting fails
    return dateObj.toLocaleString();
  }
}
