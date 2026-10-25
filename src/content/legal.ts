/** Legal documents supplied by the client (English text; served on both locale routes). */
export type LegalBlock = { type: 'p'; text: string } | { type: 'list'; items: string[] } | { type: 'lines'; lines: string[] };

export interface LegalDocument {
  title: string;
  updated: string;
  sections: { heading: string; blocks: LegalBlock[] }[];
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  'privacy-policy': {
    title: 'INTEGRA INC. — PRIVACY POLICY',
    updated: 'October 24, 2026',
    sections: [
      {
        heading: '1. WHO WE ARE AND WHAT THIS POLICY COVERS',
        blocks: [
          {
            type: 'p',
            text: 'Integra Inc. (“Integra,” “we,” “us,” or “our”) provides business process outsourcing and remote business support, including sales support, virtual assistance, customer service, technical support, website design, marketing support, and direct hire recruitment.',
          },
          {
            type: 'p',
            text: 'This Privacy Policy explains how we handle personal information when you visit https://www.integrasgp.com, contact us, request a proposal, schedule a consultation, subscribe to communications, or participate in the Integra Inc. SMS Communications program.',
          },
          {
            type: 'p',
            text: 'This Policy addresses information we handle for our own business purposes. When we process information on behalf of a client as part of contracted services, that client’s instructions, applicable service agreements, and privacy notices govern that processing. A client relationship does not authorize us to enroll that client’s contacts in Integra’s own marketing program.',
          },
        ],
      },
      {
        heading: '2. INFORMATION WE COLLECT',
        blocks: [
          {
            type: 'p',
            text: 'Depending on how you interact with us, we may collect:',
          },
          {
            type: 'list',
            items: [
              'Contact and business information: your name, email address, telephone number, company, industry, and service interests.',
              'Inquiry and service information: details you provide in forms, consultation requests, messages, proposals, and communications about your business needs.',
              'Scheduling information: appointment details and scheduling preferences.',
              'Communication preferences: your email subscription choices, SMS consent selections, and requests to stop or change communications.',
              'SMS records: the mobile number provided, the consent language presented, the date and method of opt-in, and records of messages, delivery status, support requests, and opt-outs. Where captured by the opt-in system, these records may include a form identifier, timestamp, and IP address.',
              'Technical information: our website and technology providers may process IP addresses, browser and device information, access times, referring pages, and website activity to deliver, secure, and maintain the website.',
            ],
          },
          {
            type: 'p',
            text: 'We receive information directly from you and through the systems used to operate our website, forms, scheduling, and communications. Please provide only information relevant to your request. Do not submit passwords, full payment card details, medical records, or other sensitive information through general forms or SMS.',
          },
        ],
      },
      {
        heading: '3. HOW WE USE INFORMATION',
        blocks: [
          {
            type: 'p',
            text: 'We use personal information as appropriate to:',
          },
          {
            type: 'list',
            items: [
              'Respond to inquiries and prepare requested proposals.',
              'Schedule, confirm, and remind you about consultations.',
              'Coordinate and deliver requested services and customer support.',
              'Send messages consistent with your communication preferences and consent.',
              'Maintain accurate business, consent, and suppression records.',
              'Operate, troubleshoot, protect, and improve our website and communications.',
              'Meet legal obligations, resolve disputes, and protect against misuse or fraud.',
            ],
          },
          {
            type: 'p',
            text: 'We do not treat acceptance of this Policy as permission to send marketing text messages.',
          },
        ],
      },
      {
        heading: '4. SMS CONSENT AND COMMUNICATIONS',
        blocks: [
          {
            type: 'p',
            text: 'The Integra Inc. SMS Communications program may include consultation confirmations and reminders, replies to your inquiries, requested proposal follow-ups, service coordination, and customer support. Marketing messages about Integra’s services, special offers, and promotions are sent only when you separately provide the required marketing consent.',
          },
          {
            type: 'p',
            text: 'We obtain SMS permission through a clearly disclosed opt-in process. Where both marketing and non-marketing messages are offered, the consent choices are separate, optional, and not preselected. Providing a phone number, submitting an inquiry, accepting website terms, or subscribing to email does not by itself enroll you in recurring SMS messages.',
          },
          {
            type: 'p',
            text: 'Consent to marketing texts is not a condition of purchasing goods or services. Where expressly authorized, messages may be sent using automated technology. We use your mobile number and consent records to provide the message categories you select, document permission, and honor your preferences. Consent applies to Integra and the disclosed purposes; it does not authorize marketing by another business.',
          },
          {
            type: 'p',
            text: 'Message frequency varies according to your requests, appointments, service activity, and selected message categories. Message and data rates may apply. Wireless carriers are not responsible for messages that arrive late or fail to arrive.',
          },
        ],
      },
      {
        heading: '5. MOBILE INFORMATION AND SMS CONSENT PROTECTION',
        blocks: [
          {
            type: 'p',
            text: 'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.',
          },
          {
            type: 'p',
            text: 'We may provide information to contracted support providers, including customer service providers, only as needed to support our services. Text messaging originator opt-in data and consent are excluded from all other information-sharing categories described in this Policy and will not be disclosed to outside parties for their independent use. Providers that support our SMS program may process the information strictly on our behalf to deliver messages, maintain consent records, and honor opt-out requests. They are not authorized to use it for their own marketing.',
          },
          {
            type: 'p',
            text: 'We do not sell or rent mobile information or SMS consent records, transfer consent to another sender, or permit another business to use your Integra SMS consent for its own campaigns. No general disclosure provision in this Policy authorizes third-party marketing using your mobile information or SMS consent. Legally required disclosures are limited to what applicable law requires and do not authorize marketing use.',
          },
        ],
      },
      {
        heading: '6. OPTING OUT AND GETTING HELP',
        blocks: [
          {
            type: 'p',
            text: 'SMS: Reply STOP to the number that sent you an Integra text message to unsubscribe. You may receive a final confirmation; further program messages will stop unless you provide new consent. We also honor other clear requests to stop texting made through our contact methods below. To rejoin, repeat the opt-in process and give fresh consent.',
          },
          {
            type: 'p',
            text: 'SMS support: Reply HELP to an Integra text message, call +1 415 816 6406, or contact us at https://www.integrasgp.com/contacto. The listed phone number is a support contact; reply STOP or HELP directly to the sending number.',
          },
          {
            type: 'p',
            text: 'Email: Use the unsubscribe link in a marketing email or contact us to withdraw from marketing emails. Necessary service communications may continue through appropriate non-marketing channels where permitted by law.',
          },
          {
            type: 'p',
            text: 'We may retain limited information, such as a suppressed phone number and opt-out record, to ensure we continue to honor your request. Unsubscribing does not require us to erase records needed to document consent, comply with legal obligations, or prevent further unwanted messages.',
          },
        ],
      },
      {
        heading: '7. SERVICE PROVIDERS AND OTHER DISCLOSURES',
        blocks: [
          {
            type: 'p',
            text: 'We may engage providers for hosting, business communications, scheduling, customer relationship management, security, and customer support. They receive access only as needed for their work and are subject to applicable contractual confidentiality and use restrictions.',
          },
          {
            type: 'p',
            text: 'For information other than the protected SMS information addressed in Section 5, disclosures may also occur when required by law, necessary to protect legal rights or investigate misuse, or necessary for professional advisers to support our business. Information involved in a business restructuring or transfer remains subject to applicable privacy obligations. None of these categories grants a recipient permission to use mobile information or SMS consent for its own marketing, and any successor must obtain any new consent required before messaging.',
          },
        ],
      },
      {
        heading: '8. COOKIES AND WEBSITE TECHNOLOGIES',
        blocks: [
          {
            type: 'p',
            text: 'Our website and embedded services may use cookies or similar technologies for functionality, security, preferences, and, where implemented, website measurement. Third-party scheduling or embedded tools may process information under their own notices when you interact with them.',
          },
          {
            type: 'p',
            text: 'You can manage cookies through your browser and through any consent controls offered on the website. Restricting cookies may affect certain features. Where applicable law requires consent for optional tracking, that tracking must be subject to the required consent choice. Cookie choices do not constitute SMS consent.',
          },
        ],
      },
      {
        heading: '9. RETENTION AND SECURITY',
        blocks: [
          {
            type: 'p',
            text: 'We retain personal information for as long as reasonably needed for the purposes described in this Policy, including service delivery, legal obligations, dispute resolution, and maintenance of consent and opt-out records. Retention depends on the type of information, the relationship, and applicable requirements; information is deleted or de-identified when it is no longer needed, subject to necessary backup and legal retention processes.',
          },
          {
            type: 'p',
            text: 'We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. No transmission or storage method is completely secure, and we cannot guarantee absolute security. Access should be limited to authorized personnel and providers who need the information for their work.',
          },
        ],
      },
      {
        heading: '10. YOUR PRIVACY CHOICES AND REQUESTS',
        blocks: [
          {
            type: 'p',
            text: 'Depending on your location and applicable law, you may have rights to request access to, correction of, or deletion of personal information; obtain a copy; restrict certain processing; or withdraw consent. These rights may be subject to exceptions and verification requirements.',
          },
          {
            type: 'p',
            text: 'Submit a request through https://www.integrasgp.com/contacto, call +1 415 816 6406, or write to the address below. Identify your request and the contact information associated with your interaction. We may request reasonable information to verify your identity before responding. We will respond within applicable legal time limits. You may exercise applicable privacy rights without unlawful discrimination.',
          },
          {
            type: 'p',
            text: 'Withdrawing consent affects future consent-based processing and does not invalidate processing already performed lawfully. Some information may need to be retained as explained in Section 9.',
          },
        ],
      },
      {
        heading: '11. INTERNATIONAL PROCESSING',
        blocks: [
          {
            type: 'p',
            text: 'Because Integra provides remote business support, authorized personnel and service providers may process information in the United States and other countries where they operate. Privacy laws may differ across jurisdictions. Where legally required, we apply appropriate safeguards for international transfers. These arrangements do not expand the purposes of your SMS consent or permit independent marketing by recipients.',
          },
        ],
      },
      {
        heading: '12. CHILDREN’S PRIVACY',
        blocks: [
          {
            type: 'p',
            text: 'Our website and services are directed to business users and are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided information, contact us so we can investigate and take appropriate action.',
          },
        ],
      },
      {
        heading: '13. THIRD-PARTY WEBSITES',
        blocks: [
          {
            type: 'p',
            text: 'Links to external websites and services may appear on our website. Their privacy practices are governed by their own policies. Review those notices before providing information to an external service.',
          },
        ],
      },
      {
        heading: '14. CHANGES TO THIS POLICY',
        blocks: [
          {
            type: 'p',
            text: 'We may update this Policy and revise the date above. We will provide additional notice when required by law. Policy changes do not automatically expand your SMS consent or enroll you in new message categories; new consent will be obtained where required.',
          },
        ],
      },
      {
        heading: '15. CONTACT US',
        blocks: [
          {
            type: 'lines',
            lines: [
              'Integra Inc.',
              '2651 Queen St',
              'Los Angeles, CA 90039',
              'United States',
              'Phone: +1 415 816 6406',
              'Website: https://www.integrasgp.com',
              'Privacy inquiries: https://www.integrasgp.com/contacto',
            ],
          },
          {
            type: 'p',
            text: 'SMS program terms: https://www.integrasgp.com/legal/terms-of-service',
          },
        ],
      },
    ],
  },
  'terms-of-service': {
    title: 'INTEGRA INC. — TERMS AND CONDITIONS',
    updated: 'October 24, 2026',
    sections: [
      {
        heading: '1. ABOUT THESE TERMS',
        blocks: [
          {
            type: 'p',
            text: 'These Terms and Conditions govern your use of https://www.integrasgp.com and participation in the Integra Inc. SMS messaging program. Integra Inc., referred to as “Integra,” “we,” “us,” or “our,” provides business process outsourcing and remote business support services.',
          },
          {
            type: 'p',
            text: 'Please review these Terms before using our website. Participation in our SMS program requires your separate consent as described below. Visiting our website, accepting these Terms, or providing contact information does not by itself constitute consent to receive marketing text messages.',
          },
        ],
      },
      {
        heading: '2. OUR SERVICES',
        blocks: [
          {
            type: 'p',
            text: 'Integra offers sales support, including SDR and inside sales services, prospecting, qualification, appointment scheduling, and follow-up; virtual assistance, including administrative work, scheduling, customer service, and technical support; website design; marketing and creative support; and direct hire recruitment.',
          },
          {
            type: 'p',
            text: 'Website descriptions are provided for general information. The scope, pricing, payment terms, staffing arrangements, deliverables, and cancellation terms for paid services are established in a separate written proposal or service agreement. If that agreement conflicts with these Terms regarding a paid service, the signed agreement controls for that service. No specific sales, revenue, hiring, or marketing outcome is guaranteed unless expressly stated in that agreement.',
          },
        ],
      },
      {
        heading: '3. WEBSITE USE',
        blocks: [
          {
            type: 'p',
            text: 'You agree to provide accurate information and use our website lawfully. You may not use the website to submit fraudulent requests, transmit harmful software, interfere with its operation, gain unauthorized access, or infringe another person’s rights. Submitting an inquiry or booking a consultation does not by itself establish a paid service relationship.',
          },
        ],
      },
      {
        heading: '4. INTEGRA SMS MESSAGING PROGRAM',
        blocks: [
          {
            type: 'p',
            text: 'Program name: Integra Inc. SMS Communications.',
          },
          {
            type: 'p',
            text: 'With your consent, Integra may send SMS or MMS messages related to consultation confirmations and reminders, responses to your inquiries, requested proposal follow-ups, service coordination, and customer support. If you separately opt in to marketing messages, we may also send information about Integra’s services, special offers, and promotions.',
          },
          {
            type: 'p',
            text: 'Messages are limited to the purposes covered by your consent. This program covers communications from Integra about its own business. It does not enroll you in messaging programs operated by our clients or other businesses.',
          },
        ],
      },
      {
        heading: '5. SMS CONSENT',
        blocks: [
          {
            type: 'p',
            text: 'You may enroll through an Integra form that clearly requests SMS consent or through another expressly disclosed opt-in method. Marketing and non-marketing consent are collected separately when both categories are offered. Consent choices are optional and are not preselected.',
          },
          {
            type: 'p',
            text: 'Where you expressly consent, messages may be sent using automated technology. Consent to receive marketing texts is not a condition of purchasing any goods or services. You may request information or services without enrolling in marketing texts.',
          },
          {
            type: 'p',
            text: 'You confirm that you are the subscriber or authorized user of the mobile number you provide. Please notify us if your number changes. An inquiry, newsletter subscription, or consent to email communications does not by itself authorize recurring SMS messages.',
          },
        ],
      },
      {
        heading: '6. MESSAGE FREQUENCY AND CHARGES',
        blocks: [
          {
            type: 'p',
            text: 'Message frequency varies based on your requests, appointments, service activity, and the message categories you select. Messages may recur while your enrollment remains active.',
          },
          {
            type: 'p',
            text: 'Message and data rates may apply to messages you receive from us and send to us. Contact your wireless provider for information about your messaging or data plan.',
          },
        ],
      },
      {
        heading: '7. OPTING OUT',
        blocks: [
          {
            type: 'p',
            text: 'To unsubscribe, reply STOP to any Integra text message. You may receive one final confirmation of your opt-out. No further program messages will be sent unless you provide new consent. We also honor other clear requests to stop texting, including requests made through the contact methods below.',
          },
          {
            type: 'p',
            text: 'To rejoin, complete the original opt-in process again and provide fresh consent. Opting out of SMS does not cancel an existing service agreement.',
          },
        ],
      },
      {
        heading: '8. HELP AND CUSTOMER SUPPORT',
        blocks: [
          {
            type: 'p',
            text: 'Reply HELP to an Integra text message for assistance. You can also call +1 415 816 6406 or contact us through https://www.integrasgp.com/contacto.',
          },
          {
            type: 'p',
            text: 'The support phone number is provided for customer assistance; send STOP or HELP as a reply to the number that sent you the program message.',
          },
        ],
      },
      {
        heading: '9. DELIVERY AND CARRIER RESPONSIBILITY',
        blocks: [
          {
            type: 'p',
            text: 'SMS availability and delivery depend on your wireless provider, device, coverage, and other technical factors. Delivery is not guaranteed. Carriers are not liable for delayed or undelivered messages. Text messaging should not be used for emergencies or urgent requests.',
          },
        ],
      },
      {
        heading: '10. PRIVACY AND MOBILE INFORMATION',
        blocks: [
          {
            type: 'p',
            text: 'Please review our Privacy Policy at https://www.integrasgp.com/legal/privacy-policy for information about our collection, use, and protection of personal information.',
          },
          {
            type: 'p',
            text: 'We do not sell, rent, or share mobile numbers or SMS consent information with third parties or affiliates for their marketing or promotional purposes. Providers supporting message delivery and customer support may process information only as needed to provide those services on our behalf, subject to appropriate confidentiality and use restrictions. SMS consent is specific to Integra and does not authorize marketing by another business.',
          },
          {
            type: 'p',
            text: 'Please do not send passwords, payment card details, medical information, or other sensitive information by text message.',
          },
        ],
      },
      {
        heading: '11. INTELLECTUAL PROPERTY AND THIRD-PARTY LINKS',
        blocks: [
          {
            type: 'p',
            text: 'Website text, graphics, logos, and other materials are owned by Integra or used with permission. You may not reproduce or commercially exploit them without authorization, except as permitted by law. Ownership and usage rights for client deliverables are governed by the applicable service agreement.',
          },
          {
            type: 'p',
            text: 'Our website may link to third-party websites or scheduling tools. Their own terms and privacy policies apply to their services.',
          },
        ],
      },
      {
        heading: '12. DISCLAIMERS AND LIMITATIONS',
        blocks: [
          {
            type: 'p',
            text: 'We make reasonable efforts to keep website information accurate and available, but do not guarantee uninterrupted access or that all content is free from errors. To the extent permitted by applicable law, the website is provided on an “as available” basis, and Integra is not responsible for indirect or consequential losses arising from website use. Nothing in these Terms excludes liability or limits rights that cannot lawfully be excluded or limited. Separate service agreements govern responsibility for paid services.',
          },
        ],
      },
      {
        heading: '13. CHANGES TO THESE TERMS OR THE SMS PROGRAM',
        blocks: [
          {
            type: 'p',
            text: 'We may revise these Terms and update the date shown above. We may modify, suspend, or discontinue the SMS program as permitted by law. Material changes will be communicated where required. Changes to these Terms do not expand your existing SMS consent; we will obtain new consent when required for a different messaging purpose.',
          },
        ],
      },
      {
        heading: '14. CONTACT INFORMATION',
        blocks: [
          {
            type: 'lines',
            lines: [
              'Integra Inc.',
              '2651 Queen St',
              'Los Angeles, CA 90039',
              'United States',
              'Phone: +1 415 816 6406',
              'Website: https://www.integrasgp.com',
              'Contact form: https://www.integrasgp.com/contacto',
            ],
          },
        ],
      },
    ],
  },
};
