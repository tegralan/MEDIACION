# Plataforma de Mediación Remota

Sitio para ordenar los datos de una solicitud de mediación, generar una vista previa y enviarla desde la cuenta institucional autenticada de la persona usuaria.

## Envío con Microsoft 365

La interfaz se publica en GitHub Pages y utiliza Microsoft Authentication Library (MSAL) con el flujo Authorization Code + PKCE. El correo se transmite directamente desde el navegador a Microsoft Graph después de que la persona inicia sesión y confirma el envío.

La aplicación de Microsoft Entra está configurada como SPA de inquilino único con:

- URI de redirección: `https://tegralan.github.io/MEDIACION/`
- permisos delegados: `User.Read` y `Mail.Send`
- almacenamiento de la sesión: `sessionStorage`
- ningún certificado, contraseña ni client secret

Microsoft Graph registra el mensaje en la carpeta “Enviados” de la cuenta institucional autenticada.

El destinatario se configura una sola vez en `index.html`:

```js
var RECIPIENT_EMAIL = 'mediaciononline@jusbaires.gob.ar';
```

La interfaz toma ese mismo valor para mostrar el destinatario. Esto evita que el texto visible y el envío apunten a direcciones distintas. El botón **Abrir en correo** queda disponible únicamente como alternativa manual.

## Verificación

Ejecutar:

```bash
node tests/smoke.mjs
```

La verificación controla la sintaxis del JavaScript, la consistencia del destinatario, la configuración pública de Entra, el endpoint de Microsoft Graph y la ausencia de secretos o servicios externos de formularios.

## Privacidad

Los datos se mantienen en la pestaña abierta. No se almacenan en GitHub Pages y sólo se transmiten a Microsoft Graph cuando la persona confirma expresamente el envío. El token de acceso permanece en `sessionStorage` y no se registra en el código ni en los mensajes de error.
