import type { ImageMetadata } from 'astro';
import {
  PUBLIC_GHL_BOOKING_DIRECT_HIRE,
  PUBLIC_GHL_BOOKING_MARKETING,
  PUBLIC_GHL_BOOKING_VA,
  PUBLIC_GHL_BOOKING_VENTAS,
  PUBLIC_GHL_BOOKING_WEB,
} from 'astro:env/client';
import svcSales from '../assets/img/svc-sales.webp';
import svcVa from '../assets/img/svc-support.webp';
import svcWeb from '../assets/img/svc-web.webp';
import svcMarketing from '../assets/img/svc-marketing.webp';
import svcHire from '../assets/img/svc-direct-hire.webp';
import { useTranslations, type Locale } from '../i18n';
import type { ServiceCopy, ServiceId } from '../i18n/types';

export type { ServiceId };

export interface ServiceDetail extends Omit<ServiceCopy['detail'], 'photoAlt'> {
  photo: { src: ImageMetadata; alt: string; focus: string };
}

export interface Service extends Omit<ServiceCopy, 'detail'> {
  id: ServiceId;
  /** Anchor on /servicios and value of the service query parameter (Agendar, Contacto). Same in every language. */
  slug: string;
  /** GoHighLevel booking widget URL (public, embedded on /agendar) */
  bookingUrl: string | undefined;
  detail: ServiceDetail;
}

// Language-independent data; every piece of text lives in src/i18n
const BASE: { id: ServiceId; slug: string; bookingUrl: string | undefined; photo: { src: ImageMetadata; focus: string } }[] = [
  { id: 'ventas', slug: 'ventas', bookingUrl: PUBLIC_GHL_BOOKING_VENTAS, photo: { src: svcSales, focus: '50% 30%' } },
  { id: 'va', slug: 'virtual-assistance', bookingUrl: PUBLIC_GHL_BOOKING_VA, photo: { src: svcVa, focus: '50% 30%' } },
  { id: 'web', slug: 'diseno-web', bookingUrl: PUBLIC_GHL_BOOKING_WEB, photo: { src: svcWeb, focus: '50% 30%' } },
  { id: 'marketing', slug: 'marketing', bookingUrl: PUBLIC_GHL_BOOKING_MARKETING, photo: { src: svcMarketing, focus: '50% 30%' } },
  { id: 'hire', slug: 'direct-hire', bookingUrl: PUBLIC_GHL_BOOKING_DIRECT_HIRE ?? PUBLIC_GHL_BOOKING_VENTAS, photo: { src: svcHire, focus: '50% 30%' } },
];

export const getServices = (locale: Locale): Service[] => {
  const copy = useTranslations(locale).services;
  return BASE.map(({ photo, ...base }) => {
    const { detail, ...text } = copy[base.id];
    const { photoAlt, ...rest } = detail;
    return { ...base, ...text, detail: { ...rest, photo: { src: photo.src, alt: photoAlt, focus: photo.focus } } };
  });
};
