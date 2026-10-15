export interface Industry {
  /** Anchor on /servicios and value of the ?industria= parameter on /contacto */
  slug: string;
  name: string;
  /** Three short items for the Inicio card */
  highlights: string[];
  /** One line on /servicios, carrying the target keyword */
  description: string;
  /** Stroke path (24×24 viewBox) for the decorative icon */
  icon: string;
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'bienes-raices',
    name: 'Bienes raíces',
    highlights: ['Seguimiento de leads', 'Coordinación de citas', 'Apoyo administrativo'],
    description:
      'Asistentes virtuales y SDRs para agentes e inmobiliarias: seguimiento de prospectos, coordinación de citas y tareas administrativas.',
    icon: 'M3 11l9-7.5L21 11M5.5 9.5V20h13V9.5M10 20v-6h4v6',
  },
  {
    slug: 'saas',
    name: 'SaaS',
    highlights: ['Prospección', 'Agendamiento de demos', 'Atención a usuarios'],
    description: 'SDRs e inside sales para empresas SaaS: prospección, calificación de oportunidades, demos agendadas y atención a usuarios.',
    icon: 'M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z',
  },
  {
    slug: 'firmas-legales',
    name: 'Firmas legales',
    highlights: ['Atención inicial', 'Coordinación de consultas', 'Seguimiento administrativo'],
    description:
      'Asistentes virtuales para abogados y firmas legales: recepción de consultas, citas y seguimiento. Lo jurídico lo resuelve tu equipo legal.',
    icon: 'M12 3v18M7 21h10M5 6h14M5 6l-3 7a3.5 3.5 0 0 0 6 0zM19 6l-3 7a3.5 3.5 0 0 0 6 0z',
  },
  {
    slug: 'salud',
    name: 'Salud',
    highlights: ['Agendamiento', 'Confirmación de citas', 'Atención administrativa a pacientes'],
    description:
      'Asistentes virtuales para clínicas y consultorios: agendamiento, confirmación de citas y consultas generales. Lo clínico lo atiende tu personal de salud.',
    icon: 'M12 20.5C6 16 3 12.7 3 9a4.5 4.5 0 0 1 8.2-2.5L12 7.7l.8-1.2A4.5 4.5 0 0 1 21 9c0 3.7-3 7-9 11.5zM12 9.5v5M9.5 12h5',
  },
];
