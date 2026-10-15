import type { ImageMetadata } from 'astro';
import {
  PUBLIC_GHL_BOOKING_MARKETING,
  PUBLIC_GHL_BOOKING_VA,
  PUBLIC_GHL_BOOKING_VENTAS,
  PUBLIC_GHL_BOOKING_WEB,
} from 'astro:env/client';
import svcSales from '../assets/img/svc-sales.webp';
import svcVa from '../assets/img/svc-support.webp';
import svcWeb from '../assets/img/svc-web.webp';
import svcMarketing from '../assets/img/svc-marketing.webp';

export type ServiceId = 'ventas' | 'va' | 'web' | 'marketing';

export interface ServiceDetail {
  /** Short label shown on /servicios ("Dale continuidad…") */
  lead: string;
  /** One short paragraph under the lead */
  summary: string;
  /** Four short points with check marks */
  points: string[];
  /** Full client copy, kept inside "Ver todo lo que incluye" */
  more: string[];
  /** "Qué podemos apoyar" items; `label` renders in bold before the text */
  support: { label?: string; text: string }[];
  photo: { src: ImageMetadata; alt: string; focus: string };
}

export interface Service {
  id: ServiceId;
  /** Anchor on /servicios and value of the ?servicio= parameter (Agendar, Contacto) */
  slug: string;
  name: string;
  /** One-line summary for menus and booking cards */
  short: string;
  /** Card copy on Inicio */
  lead: string;
  cta: string;
  /** Lead and topics used in the booking summary */
  bookingLead: string;
  bullets: string[];
  /** GoHighLevel booking widget URL (public, embedded on /agendar) */
  bookingUrl: string | undefined;
  detail: ServiceDetail;
}

export const SERVICES: Service[] = [
  {
    id: 'ventas',
    slug: 'ventas',
    name: 'Ventas',
    short: 'SDRs, calificación de leads y pipeline',
    lead: 'Amplía tu capacidad comercial y mantén las oportunidades en movimiento.',
    cta: 'Construir mi equipo de ventas',
    bookingLead: 'Armamos tu equipo comercial para ampliar capacidad y mantener las oportunidades en movimiento.',
    bullets: ['SDRs / Inside Sales', 'Calificación de leads', 'Appointment setting', 'Seguimiento de pipeline'],
    bookingUrl: PUBLIC_GHL_BOOKING_VENTAS,
    detail: {
      lead: 'Dale continuidad a cada oportunidad.',
      summary: 'Profesionales que prospectan, califican y dan seguimiento dentro de tu proceso, para que tu equipo se enfoque en cerrar.',
      points: ['Prospección con SDRs e Inside Sales', 'Calificación de leads', 'Agendamiento de reuniones', 'Seguimiento y CRM al día'],
      more: [
        'Te apoyamos con un equipo enfocado en prospectar, calificar contactos y dar seguimiento comercial. En Integra te ayudamos a ampliar tu capacidad de ventas con profesionales que se integran a tu proceso y mantienen tu pipeline organizado.',
        'Así, tu equipo puede dedicar más tiempo a las conversaciones y oportunidades que necesitan su atención.',
      ],
      support: [
        { text: 'Prospección y contacto inicial con SDRs e Inside Sales.' },
        { text: 'Calificación de leads según tus criterios comerciales.' },
        { text: 'Agendamiento y confirmación de reuniones de ventas.' },
        { text: 'Seguimiento de oportunidades y actualización del CRM.' },
      ],
      photo: { src: svcSales, alt: 'Agente de ventas con headset atendiendo una llamada frente a su monitor', focus: '50% 30%' },
    },
  },
  {
    id: 'va',
    slug: 'virtual-assistance',
    name: 'Virtual Assistance',
    short: 'Administración, agenda, atención al cliente y soporte técnico',
    lead: 'Delega tareas administrativas y de atención a asistentes que se integran a tu equipo.',
    cta: 'Encontrar mi asistente virtual',
    bookingLead: 'Definimos cómo delegar la administración, la agenda, la atención al cliente y el soporte técnico de tu negocio.',
    bullets: ['Asistencia administrativa', 'Organización y seguimiento', 'Atención al cliente', 'Soporte técnico'],
    bookingUrl: PUBLIC_GHL_BOOKING_VA,
    detail: {
      lead: 'Delega las tareas que mantienen tu negocio en movimiento.',
      summary: 'Asistentes virtuales que se integran a tu equipo y siguen tus procesos, desde la agenda hasta la atención al cliente.',
      points: ['Asistencia administrativa', 'Organización y seguimiento', 'Atención al cliente', 'Soporte técnico básico'],
      more: [
        'Te apoyamos con gestión de correo y agenda, organización de documentos, actualización de datos y CRM, coordinación de reuniones y seguimiento de pendientes.',
        'También cubrimos atención al cliente y soporte técnico básico, siguiendo tus procesos para mantener las solicitudes organizadas y canalizar los casos que requieren atención especializada.',
      ],
      support: [
        {
          label: 'Asistencia administrativa:',
          text: 'gestión de correo, agenda y reuniones; documentos, datos, reportes e investigación; viajes, facturas y gastos.',
        },
        { label: 'Organización y seguimiento:', text: 'actualización de CRM, bases de datos, pendientes, proveedores y apoyo de back office.' },
        {
          label: 'Atención al cliente (customer support):',
          text: 'teléfono, correo y chat; seguimiento de solicitudes, pedidos y consultas según tus políticas.',
        },
        { label: 'Soporte técnico:', text: 'acceso a cuentas, configuración básica y dudas de uso; registro de tickets y escalamiento de incidencias.' },
      ],
      photo: { src: svcVa, alt: 'Equipo de Virtual Assistance de Integra trabajando en la oficina', focus: '50% 30%' },
    },
  },
  {
    id: 'web',
    slug: 'diseno-web',
    name: 'Diseño Web',
    short: 'Sitios web, landing pages y rediseños',
    lead: 'Un sitio web profesional que convierte visitas en oportunidades.',
    cta: 'Crear mi sitio web',
    bookingLead: 'Planificamos un sitio web profesional que convierta visitas en oportunidades.',
    bullets: ['Diseño de sitios web', 'Landing pages', 'Rediseño de sitios', 'Layouts para conversión'],
    bookingUrl: PUBLIC_GHL_BOOKING_WEB,
    detail: {
      lead: 'Un sitio web que explica quién eres y cómo dar el siguiente paso.',
      summary: 'Diseñamos sitios nuevos y rediseños fáciles de navegar, alineados con tu marca y listos para móvil.',
      points: ['Sitios corporativos', 'Landing pages', 'Rediseño de sitios', 'Contenido y llamadas a la acción'],
      more: [
        'Diseñamos páginas con una estructura fácil de navegar y una presentación alineada con tu marca, pensadas para funcionar en computadoras y dispositivos móviles.',
        'Ya sea un sitio nuevo o un rediseño, buscamos que tus visitantes encuentren la información que necesitan y puedan contactarte fácilmente.',
      ],
      support: [
        { text: 'Diseño de sitios web para presentar tu empresa y servicios.' },
        { text: 'Landing pages para campañas y ofertas específicas.' },
        { text: 'Rediseño de sitios existentes.' },
        { text: 'Organización del contenido y llamadas a la acción claras.' },
      ],
      photo: { src: svcWeb, alt: 'Equipo revisando la estructura de un sitio web en una reunión', focus: '50% 30%' },
    },
  },
  {
    id: 'marketing',
    slug: 'marketing',
    name: 'Marketing Services',
    short: 'Diseño gráfico, redes y contenido',
    lead: 'Soporte creativo y digital alineado con tus objetivos.',
    cta: 'Impulsar mi marketing',
    bookingLead: 'Alineamos el soporte creativo y digital con tus objetivos.',
    bullets: ['Diseño gráfico', 'Redes sociales', 'Contenido', 'Ejecución de marketing digital'],
    bookingUrl: PUBLIC_GHL_BOOKING_MARKETING,
    detail: {
      lead: 'Mantén tu marca activa.',
      summary: 'Diseño gráfico, redes sociales y piezas digitales, con prioridades y entregables definidos contigo.',
      points: ['Diseño gráfico', 'Contenido para redes', 'Piezas para campañas', 'Ejecución de marketing digital'],
      more: [
        'Te apoyamos para crear contenido y ejecutar tus iniciativas de marketing.',
        'En Integra te ayudamos con diseño gráfico, redes sociales y materiales digitales que comunican tu oferta de forma consistente.',
        'Definimos contigo las prioridades y los entregables para que cuentes con soporte creativo y operativo, tanto en las tareas del día a día como en campañas específicas.',
      ],
      support: [
        { text: 'Diseño gráfico para materiales y canales digitales.' },
        { text: 'Creación y adaptación de contenido para redes sociales.' },
        { text: 'Desarrollo de piezas para campañas y comunicación de marca.' },
        { text: 'Apoyo en la ejecución de iniciativas de marketing digital.' },
      ],
      photo: { src: svcMarketing, alt: 'Especialista de marketing sonriendo mientras usa una tablet', focus: '50% 30%' },
    },
  },
];

export const serviceBySlug = (slug: string | null | undefined) =>
  SERVICES.find((service) => service.slug === slug);
