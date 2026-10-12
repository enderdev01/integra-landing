interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly GHL_CONTACT_WEBHOOK_URL?: string;
  readonly PUBLIC_GHL_CALENDAR_VENTAS?: string;
  readonly PUBLIC_GHL_CALENDAR_SUPPORT?: string;
  readonly PUBLIC_GHL_CALENDAR_WEB?: string;
  readonly PUBLIC_GHL_CALENDAR_MARKETING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
