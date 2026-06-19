import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — Class name utility
 * Merges Tailwind classes intelligently using clsx + tailwind-merge
 * Prevents conflicting class names and ensures proper Tailwind class resolution.
 *
 * @example cn('px-4 py-2', condition && 'bg-primary', 'px-6') → 'py-2 bg-primary px-6'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatCurrency — Format numbers as Indian Rupees
 */
export function formatCurrency(amount: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * formatNumber — Format large numbers with Indian numbering (lakhs/crores)
 */
export function formatNumber(num: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * formatDate — Format dates with locale support
 */
export function formatDate(
  date: string | Date,
  locale = 'en-IN',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * slugify — Convert string to URL-safe slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * truncate — Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

/**
 * debounce — Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * clamp — Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * lerp — Linear interpolation
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * mapRange — Map a value from one range to another
 */
export function mapRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  return outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
}

/**
 * isBrowser — Check if code is running in browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * isServer — Check if code is running on server
 */
export const isServer = !isBrowser;

/**
 * generateId — Generate a random ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * sleep — Async sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * sanitizePhone — Clean phone number to digits only
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * buildWhatsAppUrl — Build WhatsApp chat URL
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = sanitizePhone(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}
