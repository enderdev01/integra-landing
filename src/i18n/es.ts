import type { IndustryCopy, ServiceCopy, ServiceId } from './types';

export const es = {
  skipLink: 'Saltar al contenido',

  nav: { home: 'Inicio', services: 'Servicios', industries: 'Industrias', schedule: 'Agendar' },

  header: {
    homeLabel: 'Integra, ir al inicio',
    mainNav: 'Principal',
    mobileNav: 'Menú',
    viewServices: 'Ver servicios',
    viewAllServices: 'Ver todos los servicios',
    talk: '¡Hablemos!',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },

  switcher: { label: 'Idioma' },

  footer: {
    contactTitle: 'Contacta a {name}',
    customerCare: 'Atención a clientes',
    follow: 'Síguenos',
    rights: 'Todos los derechos reservados.',
    terms: 'Términos y condiciones',
  },

  legalDocs: {
    'refund-policy': 'Política de reembolso',
    'privacy-policy': 'Política de privacidad',
    'terms-of-service': 'Términos y condiciones',
    'purchase-order-terms': 'Términos de órdenes de compra',
  } as Record<string, string>,

  mobileBar: { label: 'Acciones rápidas', call: 'Llamar a Integra', book: 'Agenda una llamada' },

  seo: {
    home: {
      title: 'Integra | Equipos remotos de ventas y Virtual Assistance',
      description:
        'Equipos remotos de ventas, Virtual Assistance, diseño web y marketing para bienes raíces, SaaS, firmas legales y salud. Crece con estructura y calidad.',
    },
    services: {
      title: 'Ventas, Virtual Assistance, diseño web, marketing y Direct Hire | Integra',
      description:
        'Ventas, Virtual Assistance, diseño web, marketing y Direct Hire Recruitment que se integran a tu operación. Apoyo para bienes raíces, SaaS, firmas legales y salud.',
    },
    schedule: {
      title: 'Agenda una llamada con Integra',
      description:
        'Elige el servicio —ventas, Virtual Assistance, diseño web, marketing o Direct Hire— y reserva tu cita con el especialista indicado.',
    },
    contact: {
      title: 'Contacto | Solicita una propuesta — Integra',
      description:
        'Cuéntanos dónde quieres apoyo y te ayudamos a definir el talento, la estructura y el siguiente paso para tu equipo.',
    },
    salesOffer: 'Ventas (SDR / Inside Sales)',
  },

  hero: {
    slides: [
      { kicker: 'Equipos', connector: 'remotos que hacen', word: 'crecer', closing: 'tu operación', cta: '¡Agenda una llamada!' },
      { kicker: 'Ventas', connector: 'que mantienen tus', word: 'leads', closing: 'en movimiento', cta: 'Agenda tu cita de ventas' },
      {
        kicker: 'Soporte',
        connector: 'profesional en',
        word: 'cada',
        closing: 'canal de tus clientes',
        cta: 'Agenda tu cita de Virtual Assistance',
      },
      {
        kicker: 'Contrata',
        connector: 'talento calificado con un',
        word: 'único',
        closing: 'pago',
        cta: 'Encuentra candidatos para tu negocio',
      },
    ],
    tagline: 'Construimos equipos de ventas, soporte y back office para que tu negocio crezca con estructura, calidad y flexibilidad.',
    carousel: 'carrusel',
    slide: 'diapositiva',
    slideOf: '{n} de {total}',
    choose: 'Elegir diapositiva',
    goTo: 'Ir a la diapositiva {n}',
    pause: 'Pausar carrusel',
    play: 'Reproducir carrusel',
  },

  servicesOverview: {
    // «¿Cómo [podemos] ayudarte a hacer [crecer]?» — the bracketed words render white
    titleStart: '¿Cómo ',
    titleHighlight1: 'podemos',
    titleMiddle: ' ayudarte ',
    titleBlockStart: 'a hacer ',
    titleHighlight2: 'crecer',
    titleEnd: '?',
  },

  industriesOverview: { title: 'Industrias', more: 'Ver más' },

  servicesPage: {
    jump: 'Ir a un servicio',
    marketingChip: 'Marketing',
    hireChip: 'Direct Hire',
    industriesChip: 'Industrias',
    // «[Soluciones] que se [integran] a tu operación»
    h1Highlight1: 'Soluciones',
    h1Middle: ' que se ',
    h1Highlight2: 'integran',
    h1End: ' a tu operación',
    intro: 'Cubrimos las funciones que tu negocio necesita, desde el seguimiento comercial hasta tu presencia digital, con un alcance definido contigo.',
    seeAll: 'Ver todo lo que incluye',
    seeLess: 'Ver menos',
    support: 'Qué podemos apoyar',
    industriesTitleLime: 'In',
    industriesTitleRest: 'dustrias',
    industriesLeadStrong: 'Cada industria tiene su propio ritmo.',
    industriesLead: 'Te ayudamos a integrar apoyo comercial, administrativo y digital según las necesidades de tu negocio.',
    industriesCta: 'Hablemos de tu industria',
  },

  schedulePage: {
    h1Highlight1: 'Agenda',
    h1Middle: ' una ',
    h1Highlight2: 'llamada',
    intro: 'Elige el servicio y reserva tu cita con el especialista indicado. Cada servicio tiene su propio calendario.',
    step1: '1 · Elige tu cita',
    step2: '2 · Elige día y hora',
    appointmentOf: 'Cita de',
    yourAppointment: 'Tu cita',
    onTheCall: 'En la llamada revisamos:',
    calendarTitle: 'Calendario de reservas · Cita de {name}',
    calendarOf: 'Calendario de la Cita de {name}',
    comingSoon: 'Estamos habilitando las reservas en línea para este servicio. Escríbenos y te contactamos para coordinar la llamada.',
    toContact: 'Ir al formulario de contacto',
    preferWriting: '¿Prefieres escribirnos?',
    barLabel: 'Tu selección',
    viewCalendar: 'Ver calendario',
  },

  contactPage: {
    title: 'Hablemos de lo que necesitas.',
    intro: 'Cuéntanos dónde quieres apoyo y te ayudamos a definir el talento, la estructura y el siguiente paso.',
    next: 'Qué sigue',
    steps: ['Entendemos tus necesidades.', 'Conversamos sobre el alcance.', 'Definimos una propuesta personalizada.'],
  },

  form: {
    legend: 'Datos de contacto',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    emailPlaceholder: 'nombre@empresa.com',
    company: 'Empresa',
    service: 'Servicio de interés',
    industry: 'Industria',
    select: 'Seleccionar',
    otherIndustry: 'Otra',
    message: '¿Qué necesitas?',
    messagePlaceholder: 'Cuéntanos sobre tu equipo o proyecto',
    honeypot: 'No completar',
    consentStart: 'Acepto la ',
    consentLink: 'política de privacidad',
    consentEnd: ' y el contacto sobre mi solicitud.',
    submit: 'Solicitar una propuesta',
    sending: 'Enviando…',
    prefer: '¿Prefieres conversar?',
    bookLink: 'Agenda una llamada →',
    errors: {
      name: 'Escribe tu nombre y apellido.',
      email: 'Usa un correo válido, por ejemplo nombre@empresa.com.',
      company: 'Escribe el nombre de tu empresa.',
      service: 'Elige un servicio.',
      consent: 'Acepta la política para continuar.',
    },
    reviewOne: 'Revisa {n} campo para enviar tu solicitud.',
    reviewMany: 'Revisa {n} campos para enviar tu solicitud.',
    network: 'No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.',
    serverError: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.',
    notConfigured: 'El formulario no está configurado. Escríbenos o agenda una llamada.',
    successTitle: '¡Gracias! Recibimos tu solicitud.',
    successTitleNamed: '¡Gracias, {name}! Recibimos tu solicitud.',
    successBodyStart: 'Te escribiremos a ',
    successBodyEnd: ' para coordinar el siguiente paso.',
    summaryService: 'Servicio',
    summaryCompany: 'Empresa',
    summaryIndustry: 'Industria',
    bookNow: 'Agenda tu llamada ahora',
    backHome: 'Volver al inicio',
  },

  notFound: {
    metaTitle: 'Página no encontrada | Integra',
    metaDescription: 'La página que buscas no existe o cambió de dirección.',
    eyebrow: 'Error 404',
    title: 'No encontramos esta página',
    body: 'Puede que el enlace haya cambiado. Te dejamos los caminos más usados:',
    home: 'Volver al inicio',
    book: 'Agenda una llamada →',
  },

  legalPage: {
    metaTitle: '{title} | Integra',
    metaDescription: '{title} de {company}.',
    body: 'Estamos trabajando en ello.',
    cta: 'Ir a Contacto',
  },

  services: {
    ventas: {
      name: 'Ventas',
      short: 'SDRs, calificación de leads y pipeline',
      lead: 'Amplía tu capacidad comercial y mantén las oportunidades en movimiento.',
      cta: 'Construir mi equipo de ventas',
      bookingLead: 'Armamos tu equipo comercial para ampliar capacidad y mantener las oportunidades en movimiento.',
      bullets: ['SDRs / Inside Sales', 'Calificación de leads', 'Appointment setting', 'Seguimiento de pipeline'],
      detail: {
        lead: '',
        summary:
          'Nuestros Inside Sales Agents (ISAs) y Sales Development Representatives (SDRs) dedicados ofrecen apoyo de ventas de principio a fin, gestionan tu pipeline comercial y ayudan a convertir oportunidades en ingresos.',
        points: [
          'Prospección de leads y ventas outbound',
          'Calificación y nutrición de leads',
          'Agendamiento de citas y reuniones',
          'Seguimiento de ventas y gestión del CRM',
          'Cierre de ventas y apoyo a la conversión',
        ],
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
        photoAlt: 'Agente de ventas con headset atendiendo una llamada frente a su monitor',
      },
    },
    va: {
      name: 'Virtual Assistance',
      short: 'Administración, agenda, atención al cliente y soporte técnico',
      lead: 'Delega tareas administrativas y de atención a asistentes que se integran a tu equipo.',
      cta: 'Encontrar mi asistente virtual',
      bookingLead: 'Definimos cómo delegar la administración, la agenda, la atención al cliente y el soporte técnico de tu negocio.',
      bullets: ['Asistencia administrativa', 'Organización y seguimiento', 'Atención al cliente', 'Soporte técnico'],
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
        photoAlt: 'Equipo de Virtual Assistance de Integra trabajando en la oficina',
      },
    },
    web: {
      name: 'Diseño Web',
      short: 'Sitios web, landing pages, dominios y correos profesionales',
      lead: 'Un sitio web profesional que convierte visitas en oportunidades.',
      cta: 'Crear mi sitio web',
      bookingLead: 'Planificamos un sitio web profesional que convierta visitas en oportunidades.',
      bullets: ['Diseño de sitios web', 'Landing pages', 'Rediseño de sitios', 'Dominio, correos y administración de URL'],
      detail: {
        lead: 'Un sitio web que explica quién eres y cómo dar el siguiente paso.',
        summary:
          'Diseñamos sitios nuevos y rediseños fáciles de navegar, alineados con tu marca y listos para móvil. También nos encargamos de tu dominio, tus correos profesionales y la administración de tu URL.',
        points: ['Sitios web y landing pages', 'Rediseño de sitios', 'Compra de dominio', 'Correos electrónicos profesionales', 'Administración de URL'],
        more: [
          'Diseñamos páginas con una estructura fácil de navegar y una presentación alineada con tu marca, pensadas para funcionar en computadoras y dispositivos móviles.',
          'Ya sea un sitio nuevo o un rediseño, buscamos que tus visitantes encuentren la información que necesitan y puedan contactarte fácilmente.',
          'Además, nos encargamos de comprar tu dominio, crear los correos electrónicos de tu empresa y administrar tu URL, para que tu presencia en línea quede lista en un solo lugar.',
        ],
        support: [
          { text: 'Diseño de sitios web para presentar tu empresa y servicios.' },
          { text: 'Landing pages para campañas y ofertas específicas.' },
          { text: 'Rediseño de sitios existentes.' },
          { text: 'Organización del contenido y llamadas a la acción claras.' },
          { text: 'Compra de dominio para tu sitio web.' },
          { text: 'Creación de correos electrónicos profesionales con el dominio de tu empresa.' },
          { text: 'Administración de tu URL y dominio.' },
        ],
        photoAlt: 'Equipo revisando la estructura de un sitio web en una reunión',
      },
    },
    marketing: {
      name: 'Marketing Services',
      short: 'Diseño gráfico, redes y contenido',
      lead: 'Soporte creativo y digital alineado con tus objetivos.',
      cta: 'Impulsar mi marketing',
      bookingLead: 'Alineamos el soporte creativo y digital con tus objetivos.',
      bullets: ['Diseño gráfico', 'Redes sociales', 'Contenido', 'Ejecución de marketing digital'],
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
        photoAlt: 'Especialista de marketing sonriendo mientras usa una tablet',
      },
    },
    hire: {
      name: 'Direct Hire Recruitment',
      short: 'Reclutamiento con pago único, sin compromisos mensuales',
      lead: 'Pago único. Sin compromisos mensuales.',
      cta: 'Candidatos para tu negocio',
      bookingLead: 'Buscamos, evaluamos y te presentamos candidatos calificados. Tú los contratas directamente y pagas una sola tarifa.',
      bullets: ['Búsqueda de candidatos', 'Evaluación y selección', 'Contratación directa', 'Tarifa única de reclutamiento'],
      detail: {
        lead: 'Pago único. Sin compromisos mensuales.',
        summary:
          'Buscamos, evaluamos y te presentamos candidatos calificados para tu negocio. Tú los contratas directamente y pagas una tarifa única de reclutamiento.',
        points: ['Búsqueda de candidatos', 'Evaluación y selección', 'Presentación de candidatos calificados', 'Sin costos continuos de staffing'],
        more: [
          'Buscamos, evaluamos y te presentamos candidatos calificados para tu negocio. Tú los contratas directamente y pagas una tarifa única de reclutamiento, sin costos continuos de staffing ni de gestión.',
        ],
        support: [
          { text: 'Búsqueda de candidatos para el perfil que tu negocio necesita.' },
          { text: 'Evaluación y selección previa a la presentación.' },
          { text: 'Presentación de candidatos calificados para tu decisión.' },
          { text: 'Contratación directa por tu empresa, con una tarifa única de reclutamiento.' },
          { text: 'Sin costos continuos de staffing ni de gestión.' },
        ],
        photoAlt: 'Equipo de Integra conversando en la oficina durante una reunión de selección',
      },
    },
  } as Record<ServiceId, ServiceCopy>,

  industries: {
    'bienes-raices': {
      name: 'Bienes raíces',
      highlights: ['Seguimiento de leads', 'Coordinación de citas', 'Apoyo administrativo'],
      description:
        'Asistentes virtuales y SDRs para agentes e inmobiliarias: seguimiento de prospectos, coordinación de citas y tareas administrativas.',
    },
    saas: {
      name: 'SaaS',
      highlights: ['Prospección', 'Agendamiento de demos', 'Atención a usuarios'],
      description: 'SDRs e inside sales para empresas SaaS: prospección, calificación de oportunidades, demos agendadas y atención a usuarios.',
    },
    'firmas-legales': {
      name: 'Firmas legales',
      highlights: ['Atención inicial', 'Coordinación de consultas', 'Seguimiento administrativo'],
      description:
        'Asistentes virtuales para abogados y firmas legales: recepción de consultas, citas y seguimiento. Lo jurídico lo resuelve tu equipo legal.',
    },
    salud: {
      name: 'Salud',
      highlights: ['Agendamiento', 'Confirmación de citas', 'Atención administrativa a pacientes'],
      description:
        'Asistentes virtuales para clínicas y consultorios: agendamiento, confirmación de citas y consultas generales. Lo clínico lo atiende tu personal de salud.',
    },
  } as Record<string, IndustryCopy>,
};
