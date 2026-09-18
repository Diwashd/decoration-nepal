import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-NP')}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateEventId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `EVT-${year}-${random}`;
}

export function generateQuoteNumber(version: number = 1): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `QT-${year}-${random}-V${version}`;
}

export function getWhatsAppLink(message?: string): string {
  const defaultMessage = [
    'Namaste 11:11 Decoration Nepal!',
    '',
    'I would like to enquire about planning an event.',
    'Event type: ',
    'Preferred date: ',
    'Number of guests: ',
    '',
    'Please share the available options and quotation details.',
  ].join('\n');

  return `https://wa.me/9779847411305?text=${encodeURIComponent(message || defaultMessage)}`;
}
