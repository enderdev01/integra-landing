# Integra — sitio web

Sitio institucional de Integra Inc. construido con **Astro 7**, **Tailwind CSS 4** y desplegado en **Vercel**.
Diseño de referencia: canvas "Integra Web v2" (escritorio 1440 px y móvil 390 px).

## Requisitos

- Node.js 22.12 o superior
- npm 9.6 o superior

## Comandos

| Comando | Acción |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `http://localhost:4321` |
| `npm run check` | Validación de tipos y plantillas (`astro check`) |
| `npm run build` | Build de producción (`dist/` y `.vercel/output/`) |
| `npm run preview` | Previsualiza el build |

## Variables de entorno

Definilas en Vercel (Project → Settings → Environment Variables) o en un archivo `.env` local (no se versiona).

| Variable | Tipo | Uso |
| --- | --- | --- |
| `SITE_URL` | build | URL pública para canonical, Open Graph y sitemap. Por defecto `https://integrasgp.com` (confirmar dominio). |
| `RESEND_API_KEY` | secreta, servidor | API key de Resend que envía por correo el formulario de Contacto. Sin este valor el formulario muestra un aviso y no envía. |
| `CONTACT_FROM_EMAIL` | secreta, servidor | Remitente, por ejemplo `Integra Web <web@integrasgp.com>`. Requiere dominio verificado en Resend. Opcional: sin él usa `onboarding@resend.dev`, que solo entrega al dueño de la cuenta de Resend. |
| `PUBLIC_GHL_BOOKING_VENTAS` | pública | URL del widget de reservas de la *Cita de Ventas*. |
| `PUBLIC_GHL_BOOKING_VA` | pública | URL del widget de la *Cita de Virtual Assistance*. |
| `PUBLIC_GHL_BOOKING_WEB` | pública | URL del widget de la *Cita de Diseño Web*. |
| `PUBLIC_GHL_BOOKING_MARKETING` | pública | URL del widget de la *Cita de Marketing Services*. |
| `PUBLIC_GHL_BOOKING_DIRECT_HIRE` | pública | URL del widget de la *Cita de Direct Hire Recruitment*. Opcional: si falta, usa el calendario de Ventas (hoy los calendarios son el mismo). |
| `PUBLIC_GHL_SERVICE_FIELD` | pública | Opcional. *Unique Key* del campo «Additional information» del formulario del calendario (el que aparece tras elegir horario). Si se define, cada calendario se carga con `?<clave>=Cita de <servicio>` para autorrellenarlo; Direct Hire y Ventas pasan a ser iframes separados. |
| `GHL_WEBHOOK_URL` | secreta, servidor | Opcional. URL del *Inbound Webhook* del workflow de GoHighLevel que recibe cada solicitud del formulario de Contacto (crea el contacto). |
| `CONTACT_CC_EMAILS` | secreta, servidor | Opcional. Correos del equipo, separados por comas, que reciben copia (cc) de cada solicitud de Contacto. Va en una variable porque el repositorio es público. |
| `PUBLIC_TURNSTILE_SITE_KEY` | pública | Opcional. Site key de Cloudflare Turnstile (anti-bot del formulario de Contacto). Definir junto con `TURNSTILE_SECRET_KEY`. |
| `TURNSTILE_SECRET_KEY` | secreta, servidor | Opcional. Secret key de Turnstile; el servidor valida el token con `siteverify`. Sin las dos claves el formulario solo usa el honeypot. |
| `GHL_NEWSLETTER_WEBHOOK_URL` | secreta, servidor | Opcional. URL del *Inbound Webhook* del workflow de GoHighLevel que recibe a los suscriptores del newsletter. Sin ella, el correo de bienvenida (Resend) es el único registro y llega con copia oculta a `SITE.email`. |

Ejemplo de `.env` local:

```bash
SITE_URL=https://integrasgp.com
RESEND_API_KEY=<api-key-de-resend>
CONTACT_FROM_EMAIL=Integra Web <web@integrasgp.com>
PUBLIC_GHL_BOOKING_VENTAS=<url-del-src-del-iframe-del-calendario-de-ventas>
PUBLIC_GHL_BOOKING_VA=
PUBLIC_GHL_BOOKING_WEB=
PUBLIC_GHL_BOOKING_MARKETING=
PUBLIC_GHL_BOOKING_DIRECT_HIRE=
PUBLIC_GHL_SERVICE_FIELD=<unique-key-del-campo-additional-information>
GHL_NEWSLETTER_WEBHOOK_URL=<url-del-inbound-webhook-del-newsletter>
```

Las variables están tipadas y validadas con `astro:env` en `astro.config.mjs`.

## Integración con GoHighLevel

### Formulario de Contacto
Cada solicitud va a GoHighLevel (*Inbound Webhook* → crear contacto; trigger premium, cobra por ejecución) y por correo con Resend a `SITE.email` (con copia a `CONTACT_CC_EMAILS`). Basta con que uno de los dos destinos funcione para confirmar el envío. Protegido con honeypot, límite de enlaces en el mensaje y Cloudflare Turnstile.
1. En resend.com, crear una API key y copiarla en `RESEND_API_KEY`.
2. Las solicitudes llegan a `SITE.email` (`src/config/site.ts`, hoy `hello@integrasgp.com`); para cambiar el destinatario se edita ahí.
3. Para enviar desde un dominio propio, verificarlo en Resend (Domains) y definir `CONTACT_FROM_EMAIL`. Sin eso Resend solo entrega al correo dueño de la cuenta.
4. El correo llega en texto plano con nombre, correo, empresa, servicio, industria y mensaje; el campo `email` del visitante queda como *reply-to*.

La validación vive en `src/actions/index.ts` (zod) y se repite en el navegador para mostrar errores por campo.

### Newsletter (pop-up)
Aparece en Inicio y Servicios a los 12 s (o al intentar salir de la pestaña en escritorio) y no vuelve a mostrarse por 14 días tras cerrarlo (180 días tras suscribirse; se guarda en `localStorage`). La acción `newsletter` de `src/actions/index.ts`:
1. Envía `{ email, language, tags: ['newsletter'], source }` al *Inbound Webhook* de `GHL_NEWSLETTER_WEBHOOK_URL`. En GoHighLevel: workflow con trigger *Inbound Webhook* → *Create/Update Contact* mapeando `email` y agregando el tag `newsletter`.
2. Envía por Resend el correo de bienvenida con diseño (`src/lib/newsletter-email.ts`, ES/EN según el idioma del visitante) al suscriptor, con `reply-to` a `SITE.email`.
3. Basta con que uno de los dos funcione para confirmar la suscripción. Sin ninguno configurado, el pop-up avisa que no está disponible.

### Calendarios (página Agendar)
1. En GoHighLevel: **Calendars → (calendario) → Share → Embed** y copiar la URL del `src` del iframe.
2. Pegarla en la variable `PUBLIC_GHL_BOOKING_*` del servicio correspondiente.
3. Cada calendario se carga solo cuando el usuario elige ese servicio. `/agendar?servicio=ventas|virtual-assistance|diseno-web|marketing` preselecciona la cita; `/contacto?servicio=…&industria=bienes-raices|saas|firmas-legales|salud` preselecciona el formulario.
4. Sin URL configurada, el servicio muestra un aviso que lleva al formulario de Contacto.

> Verificar el formato del embed directamente en GoHighLevel: no se usó un snippet fijo para no depender de suposiciones.

## Idiomas (ES / EN)

- Español en la raíz (`/`, `/servicios`, `/agendar`, `/contacto`) e inglés bajo `/en` (`/en`, `/en/services`, `/en/schedule`, `/en/contact`).
- Selector ES | EN en el header. Al elegir un idioma se guarda la cookie `lang`.
- **Detección del idioma del navegador**: `vercel.json` redirige (307) las 4 rutas en español a su versión en inglés cuando el `Accept-Language` del navegador empieza por `en` y no existe la cookie `lang`. Sin cabecera (buscadores) o con cualquier otro idioma se sirve español. Solo se verifica desplegado (no corre en `npm run dev`).
- Textos: `src/i18n/es.ts` es la fuente; `src/i18n/en.ts` debe tener la misma forma (TypeScript lo exige). Rutas y helpers: `src/i18n/index.ts`.
- SEO: `<html lang>`, canonical propio, `hreflang` es / en / x-default, Open Graph y JSON-LD por idioma, y sitemap con alternativas.
- Los slugs de servicios e industrias (`ventas`, `bienes-raices`…) son los mismos en ambos idiomas; solo cambian los slugs de página. El correo del formulario llega siempre en español.
- Las páginas viven en `src/views/`; `src/pages/` y `src/pages/en/` son envoltorios de una línea.

## Estructura

```
src/
├── actions/          # Astro Actions (formulario de contacto → GoHighLevel)
├── assets/           # Imágenes optimizadas por astro:assets y logos SVG oficiales
├── components/
│   ├── layout/       # Header (submenú + menú móvil), Footer, barra de acciones móvil
│   ├── home/         # Hero y resumen de servicios
│   ├── contact/      # Formulario con estados (validación, enviando, éxito)
│   └── ui/           # Íconos de interfaz e íconos de servicio
├── config/site.ts    # Datos de contacto, menú y SEO por página
├── content/services.ts # Los 4 servicios: textos, viñetas y calendario
├── layouts/          # BaseLayout: head SEO, JSON-LD, fuentes
├── pages/            # Rutas
└── styles/global.css # Tokens de marca (Tailwind @theme) y componentes base
```

## Marca

- Colores oficiales del manual: verde lima `#A3C622` y azul profundo `#005B94`.
- Tipografía de marca: **Ibrand** (licencia web pendiente). Provisoria: Quicksand. Para reemplazarla, agregar los `.woff2` a `src/assets/fonts/` y cambiar la entrada `Quicksand` en `astro.config.mjs` por `fontProviders.local()`.
- Texto de UI: Roboto. Texto corrido: Roboto Slab.

## Pendientes antes del lanzamiento

- [ ] Página Servicios (en revisión por el cliente).
- [ ] Contenido real de las páginas legales (`/legal/*` hoy son provisorias y `noindex`); Términos y condiciones muestra «Estamos trabajando en ello».
- [ ] Teléfonos, redes sociales y dominio definitivos (`src/config/site.ts`, `SITE_URL`).
- [ ] Fuente Ibrand con licencia web.
- [ ] Webhook y URLs de calendarios de GoHighLevel.
