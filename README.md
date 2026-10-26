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
| `npm test` | Pruebas de acciones, validación y correos con proveedores simulados, sin credenciales reales |
| `npm run build` | Build de producción (`dist/` y `.vercel/output/`) |
| `npm run preview` | Previsualiza el build |

## Variables de entorno

Definilas en Vercel (Project → Settings → Environment Variables) o en un archivo `.env` local (no se versiona).

| Variable | Tipo | Uso |
| --- | --- | --- |
| `SITE_URL` | build | URL pública para canonical, Open Graph y sitemap. Por defecto `https://integrasgp.com` (confirmar dominio). |
| `RESEND_API_KEY` | secreta, servidor | API key de Resend para el correo de Contacto y la bienvenida del newsletter. Contacto también puede entregar mediante `GHL_WEBHOOK_URL`. El newsletter puede registrar la suscripción en GHL sin esta clave, pero no enviará la bienvenida desde el sitio. |
| `CONTACT_FROM_EMAIL` | secreta, servidor | Remitente, por ejemplo `Integra Web <web@integrasgp.com>`. Requiere dominio verificado en Resend. Opcional: sin él usa `onboarding@resend.dev`, que solo entrega al dueño de la cuenta de Resend. |
| `PUBLIC_GHL_BOOKING_VENTAS` | pública | URL del widget de reservas de la *Cita de Ventas*. |
| `PUBLIC_GHL_BOOKING_VA` | pública | URL del widget de la *Cita de Virtual Assistance*. |
| `PUBLIC_GHL_BOOKING_WEB` | pública | URL del widget de la *Cita de Diseño Web*. |
| `PUBLIC_GHL_BOOKING_MARKETING` | pública | URL del widget de la *Cita de Marketing Services*. |
| `PUBLIC_GHL_BOOKING_DIRECT_HIRE` | pública | URL del widget de la *Cita de Direct Hire Recruitment*. Opcional: si falta, usa el calendario de Ventas (hoy los calendarios son el mismo). |
| `PUBLIC_GHL_SERVICE_FIELD` | pública | Opcional. *Unique Key* del campo «Additional information» del formulario del calendario (el que aparece tras elegir horario). Si se define, cada calendario se carga con `?<clave>=Cita de <servicio>` para autorrellenarlo; Direct Hire y Ventas pasan a ser iframes separados. |
| `GHL_WEBHOOK_URL` | secreta, servidor | Opcional. URL del *Inbound Webhook* del workflow de GoHighLevel que recibe cada solicitud del formulario de Contacto (crea el contacto). |
| `CONTACT_CC_EMAILS` | secreta, servidor | Opcional. Correos del equipo, separados por comas, que reciben copia (cc) de cada solicitud de Contacto. Va en una variable porque el repositorio es público. |
| `PUBLIC_TURNSTILE_SITE_KEY` | pública | Site key de Cloudflare Turnstile. Requerida para el newsletter y opcional para Contacto. Definir junto con `TURNSTILE_SECRET_KEY`; los cambios requieren reconstruir el sitio. |
| `TURNSTILE_SECRET_KEY` | secreta, servidor | Secret key de Turnstile. Requerida para el newsletter: no acepta solicitudes si falta o si la verificación no puede completarse. Contacto conserva su protección opcional y su fallback documentado ante una caída de Cloudflare. |
| `GHL_NEWSLETTER_WEBHOOK_URL` | secreta, servidor | Requerida para habilitar el newsletter. URL del *Inbound Webhook* del workflow de GoHighLevel que recibe a los suscriptores. Sin ella, la acción rechaza la suscripción aunque Resend esté configurado. |
| `NEWSLETTER_WELCOME_SECRET` | secreta, servidor | Opcional durante la transición. Clave aleatoria de al menos 32 caracteres, solo en el servidor: habilita la bienvenida coordinada por GHL mediante un token firmado. No definir hasta completar el mapeo y activar el callback descrito abajo; nunca copiar esta clave ni `RESEND_API_KEY` a GHL. |

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
PUBLIC_TURNSTILE_SITE_KEY=<site-key-del-widget>
TURNSTILE_SECRET_KEY=<secret-key-del-widget>
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
El envío requiere JavaScript: el botón se habilita al instalar el manejador del formulario. Sin JavaScript se muestra un aviso y se mantiene disponible el enlace para agendar una llamada. El formulario declara POST para no incluir datos personales en la URL. Los errores de red y de la acción reinician Turnstile antes de un reintento.

### Newsletter (pop-up)
Resend se mantiene como único proveedor de envío de correos; GoHighLevel registra los suscriptores. No se requiere configurar un dominio de envío en GHL para este flujo.

Aparece inmediatamente en cada carga de Inicio y Servicios. No guarda el cierre ni la suscripción en `localStorage`. Al cerrarlo, aparece un botón flotante para volver a abrirlo; después de una suscripción exitosa, ese botón permanece oculto hasta la siguiente carga. La acción `newsletter` de `src/actions/index.ts`:
1. Requiere ambas claves de Turnstile y valida un token de un solo uso con `action=newsletter`. Si falta, es inválido, corresponde a otro formulario o Cloudflare no responde correctamente, no llama a GHL ni a Resend. El botón permanece deshabilitado hasta completar el desafío y exige un token nuevo después de un error.
2. Normaliza el correo (sin espacios externos, en minúsculas) y envía `{ email, language, tags: ['newsletter'], source }` al *Inbound Webhook* de `GHL_NEWSLETTER_WEBHOOK_URL`. En GoHighLevel: workflow con trigger *Inbound Webhook* → *Create/Update Contact* mapeando `email` y agregando el tag `newsletter`.
3. Sin `NEWSLETTER_WELCOME_SECRET`, conserva el envío directo por Resend después de que GHL acepte la solicitud. Con esa clave, agrega `welcome_token` al webhook y **no** envía directamente: GHL coordina una sola entrada por contacto y solicita el envío a `POST /api/newsletter-welcome` con `{ "token": "{{contact.newsletter_welcome_token}}" }`. El token firma el correo, idioma y fecha; la clave nunca sale del servidor. El callback envía la misma plantilla ES/EN de `src/lib/newsletter-email.ts` mediante Resend, con `reply-to` a `SITE.email`.
4. Ambos caminos usan una clave de idempotencia derivada del correo mediante SHA-256. [Resend la conserva durante 24 horas](https://resend.com/docs/dashboard/emails/idempotency-keys). El token del callback vence a las 20 horas para impedir reejecuciones fuera de esa protección; un token alterado, vencido o con fecha futura se rechaza sin llamar a Resend. Los reintentos simultáneos usan la misma clave incluso entre instancias. Un cambio de contenido bajo esa clave puede impedir el reintento en vez de reenviar.
5. Si GHL falta o rechaza la solicitud, no confirma éxito ni envía la bienvenida. Un fallo posterior de Resend no revierte la suscripción. En modo callback responde 502 para que GHL pueda reintentar y deja un mensaje sin datos personales. La aceptación de Resend no garantiza la entrega en la bandeja del destinatario.

La respuesta HTTP del webhook confirma la recepción, no la ejecución completa del workflow. Se debe supervisar el workflow en GHL. No se guarda una lista de suscriptores ni un contador de IP por instancia. Turnstile controla bots, no establece un límite de frecuencia por IP.

### Activación y controles externos pendientes

Esta lista requiere acceso autorizado a las cuentas de Cloudflare, GHL y Vercel. No se aplica automáticamente desde el repositorio.

- [x] Turnstile real verificado en producción para altas ES/EN. No usar claves ficticias de las pruebas en producción.
- [x] El workflow de entrada mapea correo y token antes de aplicar `newsletter`; el alta repetida de prueba no produjo otra bienvenida. La revisión de duplicados históricos del CRM sigue siendo operativa.
- [x] Publicar y verificar el callback de GHL descrito abajo. **Allow Re-entry** y múltiples oportunidades deben permanecer desactivados en ese workflow. El historial de entrada es por contacto: no sustituye la deduplicación por correo de los contactos del CRM.
- [x] Mantener Resend como único proveedor de bienvenida. El coordinador de GHL no contiene acciones Send Email ni recibe credenciales de Resend.
- [ ] Configurar un límite de frecuencia en el firewall del despliegue para solicitudes POST a `/_actions/newsletter` y `/_actions/contact`, incluyendo variantes con barra final. [Vercel permite limitar por IP](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting); verificar condiciones y costos del plan, observar primero en modo Log y después aplicar 429. Sus contadores son regionales, no una garantía global exacta.
- [ ] Probar un correo nuevo, otro ya suscrito, dos envíos simultáneos con tokens diferentes, un token repetido y una caída de GHL. Confirmar en los registros de GHL y Resend que no hay altas perdidas ni bienvenidas dobles. Repetir el caso de suscriptor existente después de 24 horas para validar la regla permanente, no solo la idempotencia temporal.

#### Callback de GHL y transición (2026-10-25)

El coordinador **Integra Web - Newsletter - Resend callback** está publicado. Mantiene el trigger de tag `newsletter`, reingreso y múltiples oportunidades desactivados, y el guard **sin `newsletter-welcome-sent` AND `Newsletter welcome token` no vacío**. Su única acción de envío es un Custom Webhook POST JSON con `{ "token": "{{contact.newsletter_welcome_token}}" }` a `https://www.integrasgp.com/api/newsletter-welcome`. La acción tiene costo por ejecución; no contiene correos nativos ni claves de Resend.

El workflow de entrada publicado conserva Email y mapea `welcome_token` al campo `contact.newsletter_welcome_token` **antes** de agregar `newsletter`. El idioma viaja firmado dentro del token; el campo `Newsletter language` no interviene en el envío. `NEWSLETTER_WELCOME_SECRET` está configurada solo en Production de Vercel. No cambiarla mientras haya tokens pendientes sin coordinar su invalidación.

Se promovió el build de producción `dpl_AxFqtSEv8HcD1gJJDvcyc9qGUcyb` del commit `a5001a7bde9d6d8e7f67b9777a6cb8e548758867`, después de verificar 22 pruebas, Astro check/build y pruebas del callback aislado. Las 14 rutas públicas revisadas responden 200; el dominio raíz redirige 308 a `www.integrasgp.com`. Las altas ES/EN desde Brave con Turnstile real y destinatarios simulados de Resend terminaron en GHL con Custom Webhook Success HTTP 204. Repetir el correo de prueba ES fue aceptado sin otra ejecución de bienvenida. No se enviaron correos a personas reales.

La aceptación de Resend no prueba entrega en una bandeja real. El callback rechaza tokens inválidos o vencidos con 401, cuerpos excesivos con 413 y fallos del proveedor con 502. Los reintentos usan la misma clave de idempotencia. Supervisar fallos de GHL cerca del vencimiento de 20 horas; no regenerar tokens ni forzar reinscripciones sin comprobar el historial de Resend.

La supresión permanente es por contacto y depende de conservar su identidad e historial del workflow. No quitar/reaplicar tags en bloque ni incorporar contactos antiguos manualmente al coordinador. Borrar/recrear contactos o mantener duplicados del CRM puede romper esa garantía. La prueba real después de 24 horas y los límites WAF siguen pendientes; no se provocaron caídas de proveedores reales.

No se modificaron dominios ni DNS ni se compartieron claves con GHL. Como respaldo se conserva el despliegue anterior `dpl_GuVDMePLSD3utxXaFWjrP5RSz2j4` (commit `12d3fbe70b274346375981d49375ff00e61f845d`). Revertir el sitio al modo anterior también revierte la coordinación permanente; revisar contactos y envíos antes de hacerlo.

### Calendarios (página Agendar)
1. En GoHighLevel: **Calendars → (calendario) → Share → Embed** y copiar la URL del `src` del iframe.
2. Pegarla en la variable `PUBLIC_GHL_BOOKING_*` del servicio correspondiente.
3. El calendario inicial se carga primero; los demás se precargan cuando la página está inactiva, salvo con ahorro de datos o conexión 2G. Elegir un servicio también carga su calendario si aún no está cargado. `/agendar?servicio=ventas|virtual-assistance|diseno-web|marketing|direct-hire` preselecciona la cita; `/contacto?servicio=…&industria=bienes-raices|saas|firmas-legales|salud` preselecciona el formulario.
4. Sin URL configurada, el servicio muestra un aviso que lleva al formulario de Contacto.

> Verificar el formato del embed directamente en GoHighLevel: no se usó un snippet fijo para no depender de suposiciones.

## Admin de imágenes (`/admin`)

El cliente cambia las 9 fotos del sitio (4 del hero, 5 de servicios) desde `/admin`, con contraseña. Las fotos se guardan en un bucket **privado** de Cloudflare R2; al pulsar **Publicar** se dispara un deploy hook de Vercel y el build (`scripts/pull-images.mjs`) copia las fotos de R2 sobre `src/assets/img` antes de `astro build`, así `astro:assets` sigue optimizándolas. Sin variables de R2 (o si R2 falla) el build usa las fotos del repo.

Variables en Vercel (todas secretas, opcionales; sin ellas `/admin` responde 401/503):

| Variable | Qué es |
| --- | --- |
| `ADMIN_PASSWORD` | Contraseña del admin, mínimo 16 caracteres |
| `R2_ACCOUNT_ID`, `R2_BUCKET` | Cuenta y bucket de Cloudflare R2 |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Token R2 con permiso Object Read & Write sobre ese bucket |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel → Settings → Git → Deploy Hooks (rama `main`) |

Un build local con las variables de R2 sobrescribe `src/assets/img`; descarta esos cambios con `git checkout src/assets/img`.

## Pruebas de navegador locales

Para probar todos los caminos del widget sin claves reales, ejecutar `PUBLIC_TURNSTILE_SITE_KEY=audit-test-key npm run build` y servir `dist/client` con `python3 -m http.server 4321 --bind 127.0.0.1 --directory dist/client`. La clave es ficticia: el navegador sustituye el script de Cloudflare con un simulador local. En otra terminal, con `playwright-cli` instalado:

```bash
playwright-cli -s=integra-regressions open about:blank
playwright-cli -s=integra-regressions run-code --filename=tests/browser-regressions.js
playwright-cli -s=integra-regressions close
npm run build
```

Estas pruebas verifican el fallback sin JavaScript, el idioma legal, el montaje del desafío al abrir el modal, expiración, reintentos, errores de red y del servidor, envío duplicado y éxito del newsletter. Bloquean o simulan todas las solicitudes fuera del servidor local y no envían consultas reales. Sin una site key, verifican que el newsletter quede deshabilitado con un aviso. El último `npm run build` restaura el build con la configuración habitual: no desplegar el build con la clave ficticia.

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
├── content/services.ts # Los 5 servicios: textos, viñetas y calendario
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
- [ ] Contenido real de Reembolsos y Términos de órdenes de compra (todavía provisorios y `noindex`). Privacidad y Términos del servicio ya muestran los documentos en inglés entregados por el cliente.
- [ ] Teléfonos, redes sociales y dominio definitivos (`src/config/site.ts`, `SITE_URL`).
- [ ] Fuente Ibrand con licencia web.
- [ ] Webhook y URLs de calendarios de GoHighLevel.
