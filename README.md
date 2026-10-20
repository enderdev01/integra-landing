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
| `PUBLIC_GHL_BOOKING_DIRECT_HIRE` | pública | URL del widget de la *Cita de Direct Hire Recruitment*. |

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
```

Las variables están tipadas y validadas con `astro:env` en `astro.config.mjs`.

## Integración con GoHighLevel

### Formulario de Contacto
Se envía por correo con Resend (el trigger *Inbound Webhook* de GoHighLevel es premium y cobra por ejecución, por eso no se usa).
1. En resend.com, crear una API key y copiarla en `RESEND_API_KEY`.
2. Las solicitudes llegan a `SITE.email` (`src/config/site.ts`, hoy `hello@integrasgp.com`); para cambiar el destinatario se edita ahí.
3. Para enviar desde un dominio propio, verificarlo en Resend (Domains) y definir `CONTACT_FROM_EMAIL`. Sin eso Resend solo entrega al correo dueño de la cuenta.
4. El correo llega en texto plano con nombre, correo, empresa, servicio, industria y mensaje; el campo `email` del visitante queda como *reply-to*.

La validación vive en `src/actions/index.ts` (zod) y se repite en el navegador para mostrar errores por campo.

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
- [ ] Contenido real de las páginas legales (`/legal/*` hoy son provisorias y `noindex`).
- [ ] Teléfonos, redes sociales y dominio definitivos (`src/config/site.ts`, `SITE_URL`).
- [ ] Fuente Ibrand con licencia web.
- [ ] Webhook y URLs de calendarios de GoHighLevel.
