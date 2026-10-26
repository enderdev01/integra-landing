/** Editable photos. `file` matches src/assets/img and the R2 key img/<file>; `maxWidth` caps the browser-side resize. */
export const IMAGE_SLOTS = [
  { file: 'hero-office.webp', label: 'Inicio · Slide 1 (Equipos)', maxWidth: 2200 },
  { file: 'hero-sales.webp', label: 'Inicio · Slide 2 (Ventas)', maxWidth: 2200 },
  { file: 'hero-support.webp', label: 'Inicio · Slide 3 (Soporte)', maxWidth: 2200 },
  { file: 'hero-direct-hire.webp', label: 'Inicio · Slide 4 (Direct Hire)', maxWidth: 2200 },
  { file: 'svc-sales.webp', label: 'Servicio · Ventas', maxWidth: 1200 },
  { file: 'svc-support.webp', label: 'Servicio · Virtual Assistance', maxWidth: 1200 },
  { file: 'svc-web.webp', label: 'Servicio · Diseño web', maxWidth: 1200 },
  { file: 'svc-marketing.webp', label: 'Servicio · Marketing', maxWidth: 1200 },
  { file: 'svc-direct-hire.webp', label: 'Servicio · Direct Hire', maxWidth: 1200 },
] as const;

export const isImageSlot = (file: unknown): file is (typeof IMAGE_SLOTS)[number]['file'] =>
  IMAGE_SLOTS.some((slot) => slot.file === file);
