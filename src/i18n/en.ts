import type { Dictionary } from './types';

export const en: Dictionary = {
  skipLink: 'Skip to content',

  nav: { home: 'Home', services: 'Services', industries: 'Industries', schedule: 'Book a call' },

  header: {
    homeLabel: 'Integra, go to home',
    mainNav: 'Main',
    mobileNav: 'Menu',
    viewServices: 'View services',
    viewAllServices: 'View all services',
    talk: "Let's talk!",
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  switcher: { label: 'Language' },

  footer: {
    contactTitle: 'Contact {name}',
    customerCare: 'Customer service',
    tollFree: 'Toll free:',
    follow: 'Follow us',
    legalNav: 'Legal',
    rights: 'All rights reserved.',
  },

  legalDocs: {
    'refund-policy': 'Refund policy',
    'privacy-policy': 'Privacy policy',
    'terms-of-service': 'Terms of service',
    'purchase-order-terms': 'Purchase order terms',
  },

  mobileBar: { label: 'Quick actions', call: 'Call Integra', book: 'Book a call' },

  seo: {
    home: {
      title: 'Integra | Remote sales teams and Virtual Assistance',
      description:
        'Remote sales teams, Virtual Assistance, web design and marketing for real estate, SaaS, law firms and healthcare. Grow with structure and quality.',
    },
    services: {
      title: 'Sales, Virtual Assistance, web design and marketing | Integra',
      description:
        'Sales, Virtual Assistance, web design and marketing that plug into your operation. Support for real estate, SaaS, law firms and healthcare.',
    },
    schedule: {
      title: 'Book a call with Integra',
      description:
        'Choose the service —sales, Virtual Assistance, web design or marketing— and book with the right specialist.',
    },
    contact: {
      title: 'Contact | Request a proposal — Integra',
      description:
        'Tell us where you need support and we will help you define the talent, structure and next step for your team.',
    },
    salesOffer: 'Sales (SDR / Inside Sales)',
  },

  hero: {
    slides: [
      { kicker: 'Remote teams', connector: 'built to', word: 'grow', closing: 'your operation', cta: 'Book a call!' },
      { kicker: 'Sales', connector: 'that keep your', word: 'leads', closing: 'moving', cta: 'Book your sales call' },
      {
        kicker: 'Support',
        connector: "that's professional on",
        word: 'every',
        closing: 'customer channel',
        cta: 'Book your Virtual Assistance call',
      },
    ],
    tagline: 'We build sales, support and back-office teams so your business grows with structure, quality and flexibility.',
    carousel: 'carousel',
    slide: 'slide',
    slideOf: '{n} of {total}',
    choose: 'Choose slide',
    goTo: 'Go to slide {n}',
    pause: 'Pause carousel',
    play: 'Play carousel',
  },

  servicesOverview: {
    // «What can [we] help you [grow]?»
    titleStart: 'What can ',
    titleHighlight1: 'we',
    titleMiddle: ' help you ',
    titleBlockStart: '',
    titleHighlight2: 'grow',
    titleEnd: '?',
  },

  industriesOverview: { title: 'Industries', more: 'Learn more' },

  servicesPage: {
    jump: 'Jump to a service',
    marketingChip: 'Marketing',
    industriesChip: 'Industries',
    // «[Solutions] that [integrate] into your operation»
    h1Highlight1: 'Solutions',
    h1Middle: ' that ',
    h1Highlight2: 'integrate',
    h1End: ' into your operation',
    intro: 'We cover the functions your business needs, from sales follow-up to your digital presence, with a scope defined together with you.',
    seeAll: 'See everything included',
    seeLess: 'See less',
    support: 'What we can support',
    industriesTitleLime: 'In',
    industriesTitleRest: 'dustries',
    industriesLeadStrong: 'Every industry has its own rhythm.',
    industriesLead: 'We help you bring together sales, administrative and digital support according to your business needs.',
    industriesCta: "Let's talk about your industry",
  },

  schedulePage: {
    h1Highlight1: 'Book',
    h1Middle: ' a ',
    h1Highlight2: 'call',
    intro: 'Choose the service and book with the right specialist. Each service has its own calendar.',
    step1: '1 · Choose your appointment',
    step2: '2 · Pick a day and time',
    appointmentOf: 'Appointment for',
    yourAppointment: 'Your appointment',
    onTheCall: 'On the call we review:',
    calendarTitle: 'Booking calendar · Appointment for {name}',
    calendarOf: 'Appointment calendar for {name}',
    comingSoon: 'We are enabling online booking for this service. Write to us and we will contact you to schedule the call.',
    toContact: 'Go to the contact form',
    preferWriting: 'Prefer to write to us?',
    barLabel: 'Your selection',
    viewCalendar: 'View calendar',
  },

  contactPage: {
    title: "Let's talk about what you need.",
    intro: 'Tell us where you need support and we will help you define the talent, structure and next step.',
    next: "What's next",
    steps: ['We understand your needs.', 'We discuss the scope.', 'We define a tailored proposal.'],
  },

  form: {
    legend: 'Contact details',
    name: 'Full name',
    email: 'Email address',
    emailPlaceholder: 'name@company.com',
    company: 'Company',
    service: 'Service of interest',
    industry: 'Industry',
    select: 'Select',
    otherIndustry: 'Other',
    message: 'What do you need?',
    messagePlaceholder: 'Tell us about your team or project',
    honeypot: 'Leave blank',
    consentStart: 'I accept the ',
    consentLink: 'privacy policy',
    consentEnd: ' and being contacted about my request.',
    submit: 'Request a proposal',
    sending: 'Sending…',
    prefer: 'Prefer to talk?',
    bookLink: 'Book a call →',
    errors: {
      name: 'Enter your first and last name.',
      email: 'Use a valid email, for example name@company.com.',
      company: 'Enter your company name.',
      service: 'Choose a service.',
      consent: 'Accept the policy to continue.',
    },
    reviewOne: 'Review {n} field to send your request.',
    reviewMany: 'Review {n} fields to send your request.',
    network: "We couldn't connect. Check your connection and try again.",
    serverError: "We couldn't send your request. Please try again in a few minutes.",
    notConfigured: 'The form is not set up yet. Write to us or book a call.',
    successTitle: 'Thank you! We received your request.',
    successTitleNamed: 'Thank you, {name}! We received your request.',
    successBodyStart: 'We will write to ',
    successBodyEnd: ' to coordinate the next step.',
    summaryService: 'Service',
    summaryCompany: 'Company',
    summaryIndustry: 'Industry',
    bookNow: 'Book your call now',
    backHome: 'Back to home',
  },

  notFound: {
    metaTitle: 'Page not found | Integra',
    metaDescription: "The page you are looking for doesn't exist or has moved.",
    eyebrow: 'Error 404',
    title: "We couldn't find this page",
    body: 'The link may have changed. Here are the most used paths:',
    home: 'Back to home',
    book: 'Book a call →',
  },

  legalPage: {
    metaTitle: '{title} | Integra',
    metaDescription: '{title} — {company}.',
    body: 'We are updating this document. If you need information about the {titleLower} of {company}, write to us and we will get back to you shortly.',
    cta: 'Go to Contact',
  },

  services: {
    ventas: {
      name: 'Sales',
      short: 'SDRs, lead qualification and pipeline',
      lead: 'Expand your sales capacity and keep opportunities moving.',
      cta: 'Build my sales team',
      bookingLead: 'We build your commercial team to expand capacity and keep opportunities moving.',
      bullets: ['SDRs / Inside Sales', 'Lead qualification', 'Appointment setting', 'Pipeline follow-up'],
      detail: {
        lead: 'Give every opportunity continuity.',
        summary: 'Professionals who prospect, qualify and follow up within your process, so your team can focus on closing.',
        points: ['Prospecting with SDRs and Inside Sales', 'Lead qualification', 'Meeting scheduling', 'Follow-up and an up-to-date CRM'],
        more: [
          'We support you with a team focused on prospecting, qualifying contacts and commercial follow-up. At Integra we help you expand your sales capacity with professionals who plug into your process and keep your pipeline organized.',
          'This way, your team can spend more time on the conversations and opportunities that need their attention.',
        ],
        support: [
          { text: 'Prospecting and first contact with SDRs and Inside Sales.' },
          { text: 'Lead qualification based on your commercial criteria.' },
          { text: 'Scheduling and confirmation of sales meetings.' },
          { text: 'Opportunity follow-up and CRM updates.' },
        ],
        photoAlt: 'Sales agent with a headset taking a call in front of a monitor',
      },
    },
    va: {
      name: 'Virtual Assistance',
      short: 'Administration, scheduling, customer service and tech support',
      lead: 'Delegate administrative and customer-care tasks to assistants who join your team.',
      cta: 'Find my virtual assistant',
      bookingLead: 'We define how to delegate administration, scheduling, customer service and technical support for your business.',
      bullets: ['Administrative assistance', 'Organization and follow-up', 'Customer service', 'Technical support'],
      detail: {
        lead: 'Delegate the tasks that keep your business moving.',
        summary: 'Virtual assistants who join your team and follow your processes, from scheduling to customer service.',
        points: ['Administrative assistance', 'Organization and follow-up', 'Customer service', 'Basic technical support'],
        more: [
          'We support you with email and calendar management, document organization, data and CRM updates, meeting coordination and follow-up on pending items.',
          'We also cover customer service and basic technical support, following your processes to keep requests organized and route the cases that need specialized attention.',
        ],
        support: [
          {
            label: 'Administrative assistance:',
            text: 'email, calendar and meeting management; documents, data, reports and research; travel, invoices and expenses.',
          },
          { label: 'Organization and follow-up:', text: 'CRM and database updates, pending tasks, vendors and back-office support.' },
          {
            label: 'Customer service (customer support):',
            text: 'phone, email and chat; follow-up on requests, orders and inquiries according to your policies.',
          },
          { label: 'Technical support:', text: 'account access, basic setup and usage questions; ticket logging and incident escalation.' },
        ],
        photoAlt: 'Integra Virtual Assistance team working in the office',
      },
    },
    web: {
      name: 'Web Design',
      short: 'Websites, landing pages and redesigns',
      lead: 'A professional website that turns visits into opportunities.',
      cta: 'Create my website',
      bookingLead: 'We plan a professional website that turns visits into opportunities.',
      bullets: ['Website design', 'Landing pages', 'Website redesign', 'Conversion-focused layouts'],
      detail: {
        lead: 'A website that explains who you are and how to take the next step.',
        summary: 'We design new sites and redesigns that are easy to navigate, aligned with your brand and mobile-ready.',
        points: ['Corporate websites', 'Landing pages', 'Website redesign', 'Content and calls to action'],
        more: [
          'We design pages with an easy-to-navigate structure and a presentation aligned with your brand, built to work on computers and mobile devices.',
          'Whether it is a new site or a redesign, we make sure your visitors find the information they need and can contact you easily.',
        ],
        support: [
          { text: 'Website design to present your company and services.' },
          { text: 'Landing pages for specific campaigns and offers.' },
          { text: 'Redesign of existing websites.' },
          { text: 'Content organization and clear calls to action.' },
        ],
        photoAlt: 'Team reviewing the structure of a website in a meeting',
      },
    },
    marketing: {
      name: 'Marketing Services',
      short: 'Graphic design, social media and content',
      lead: 'Creative and digital support aligned with your goals.',
      cta: 'Boost my marketing',
      bookingLead: 'We align creative and digital support with your goals.',
      bullets: ['Graphic design', 'Social media', 'Content', 'Digital marketing execution'],
      detail: {
        lead: 'Keep your brand active.',
        summary: 'Graphic design, social media and digital pieces, with priorities and deliverables defined together with you.',
        points: ['Graphic design', 'Social media content', 'Campaign assets', 'Digital marketing execution'],
        more: [
          'We help you create content and carry out your marketing initiatives.',
          'At Integra we help with graphic design, social media and digital materials that communicate your offer consistently.',
          'We define priorities and deliverables with you so you have creative and operational support, both for day-to-day tasks and for specific campaigns.',
        ],
        support: [
          { text: 'Graphic design for materials and digital channels.' },
          { text: 'Creation and adaptation of social media content.' },
          { text: 'Development of campaign and brand communication pieces.' },
          { text: 'Support in executing digital marketing initiatives.' },
        ],
        photoAlt: 'Marketing specialist smiling while using a tablet',
      },
    },
  },

  industries: {
    'bienes-raices': {
      name: 'Real estate',
      highlights: ['Lead follow-up', 'Appointment coordination', 'Administrative support'],
      description:
        'Virtual assistants and SDRs for real estate agents and agencies: prospect follow-up, appointment coordination and administrative tasks.',
    },
    saas: {
      name: 'SaaS',
      highlights: ['Prospecting', 'Demo scheduling', 'User support'],
      description: 'SDRs and inside sales for SaaS companies: prospecting, opportunity qualification, scheduled demos and user support.',
    },
    'firmas-legales': {
      name: 'Law firms',
      highlights: ['Initial intake', 'Consultation coordination', 'Administrative follow-up'],
      description:
        'Virtual assistants for attorneys and law firms: inquiry intake, appointments and follow-up. Legal matters stay with your legal team.',
    },
    salud: {
      name: 'Healthcare',
      highlights: ['Scheduling', 'Appointment confirmation', 'Patient administrative support'],
      description:
        'Virtual assistants for clinics and practices: scheduling, appointment confirmations and general inquiries. Clinical matters are handled by your healthcare staff.',
    },
  },
};
