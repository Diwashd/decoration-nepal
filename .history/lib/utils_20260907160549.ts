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

export function getPlannerWhatsAppMessage(details: {
  eventId?: string;
  eventTypeName?: string;
  eventDates?: string[];
  guestCount?: string;
  venue?: string;
  venueAddress?: string;
  budgetRange?: string;
  customerName?: string;
  customerPhone?: string;
  specialRequests?: string;
}): string {
  return [
    'Namaste 11:11 Decoration Nepal!',
    '',
    'I have submitted an event planning request and would like to discuss it on WhatsApp.',
    details.eventId ? `Reference: ${details.eventId}` : '',
    `Name: ${details.customerName || 'Not provided'}`,
    `Event type: ${details.eventTypeName || 'Not provided'}`,
    `Preferred dates: ${details.eventDates?.join(', ') || 'Not provided'}`,
    `Guests: ${details.guestCount || 'Not provided'}`,
    `Venue: ${details.venue || 'Not provided'}`,
    details.venueAddress ? `Venue address: ${details.venueAddress}` : '',
    `Budget: ${details.budgetRange || 'Not provided'}`,
    details.customerPhone ? `Phone: ${details.customerPhone}` : '',
    `Special requests: ${details.specialRequests || 'None'}`,
    '',
    'Please confirm the next steps and quotation details.',
  ].filter(Boolean).join('\n');
}

export function getPlannerCompletedWhatsAppMessage(details: {
  eventId?: string;
  eventTypeName?: string;
  eventDates?: string[];
  guestCount?: string;
  venue?: string;
  specialRequests?: string;
}): string {
  return [
    'Namaste 11:11 Decoration Nepal!',
    '',
    'I have completed the event planner on your website.',
    'Please review my planner request and send the quotation back to me through the website.',
    '',
    details.eventId ? `Reference: ${details.eventId}` : '',
    `Event type: ${details.eventTypeName || 'Not provided'}`,
    `Preferred dates: ${details.eventDates?.join(', ') || 'Not provided'}`,
    `Guests: ${details.guestCount || 'Not provided'}`,
    `Venue: ${details.venue || 'Not provided'}`,
    details.specialRequests ? `Special requests: ${details.specialRequests}` : '',
  ].filter(Boolean).join('\n');
}
