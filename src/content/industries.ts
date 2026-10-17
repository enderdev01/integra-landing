import type { ArtworkName } from '../components/ui/artwork';

export interface Industry {
  /** Anchor on /servicios and value of the ?industria= parameter on /contacto */
  slug: string;
  name: string;
  /** Three short items for the Inicio card */
  highlights: string[];
  /** One line on /servicios, carrying the target keyword */
  description: string;
  /** Decorative pictogram from the v3 artwork */
  icon: ArtworkName;
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'bienes-raices',
    name: 'Bienes raíces',
    highlights: ['Seguimiento de leads', 'Coordinación de citas', 'Apoyo administrativo'],
    description:
      'Asistentes virtuales y SDRs para agentes e inmobiliarias: seguimiento de prospectos, coordinación de citas y tareas administrativas.',
    icon: 'industry-real-estate',
  },
  {
    slug: 'saas',
    name: 'SaaS',
    highlights: ['Prospección', 'Agendamiento de demos', 'Atención a usuarios'],
    description: 'SDRs e inside sales para empresas SaaS: prospección, calificación de oportunidades, demos agendadas y atención a usuarios.',
    icon: 'industry-saas',
  },
  {
    slug: 'firmas-legales',
    name: 'Firmas legales',
    highlights: ['Atención inicial', 'Coordinación de consultas', 'Seguimiento administrativo'],
    description:
      'Asistentes virtuales para abogados y firmas legales: recepción de consultas, citas y seguimiento. Lo jurídico lo resuelve tu equipo legal.',
    icon: 'industry-legal',
  },
  {
    slug: 'salud',
    name: 'Salud',
    highlights: ['Agendamiento', 'Confirmación de citas', 'Atención administrativa a pacientes'],
    description:
      'Asistentes virtuales para clínicas y consultorios: agendamiento, confirmación de citas y consultas generales. Lo clínico lo atiende tu personal de salud.',
    icon: 'industry-health',
  },
];
