import type { es } from './es';

export type ServiceId = 'ventas' | 'va' | 'web' | 'marketing' | 'hire';

export interface ServiceCopy {
  name: string;
  /** One-line summary for menus and booking cards */
  short: string;
  /** Card copy on Inicio */
  lead: string;
  cta: string;
  /** Lead and topics used in the booking summary */
  bookingLead: string;
  bullets: string[];
  detail: {
    lead: string;
    summary: string;
    points: string[];
    /** Full client copy, kept inside "Ver todo lo que incluye" */
    more: string[];
    /** `label` renders in bold before the text */
    support: { label?: string; text: string }[];
    photoAlt: string;
  };
}

export interface IndustryCopy {
  name: string;
  highlights: string[];
  description: string;
}

/** Spanish is the source of truth; English must match its shape */
export type Dictionary = typeof es;
