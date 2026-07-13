# Plataforma de Mediación Remota

Sitio estático para ordenar los datos de una solicitud de mediación, generar una vista previa y abrir un borrador en la aplicación de correo de la persona usuaria.

## Funcionamiento del correo

GitHub Pages no puede enviar correos directamente porque no ejecuta un servidor. La plataforma utiliza un enlace `mailto:`: prepara destinatario, asunto y cuerpo, pero el envío sólo ocurre cuando la persona lo confirma desde su correo.

El destinatario se configura una sola vez en `index.html`:

```js
var RECIPIENT_EMAIL = 'mediaciononline@jusbaires.gob.ar';
```

La interfaz toma ese mismo valor para mostrar el destinatario. Esto evita que el texto visible y el correo preparado apunten a direcciones distintas.

## Verificación

Ejecutar:

```bash
node tests/smoke.mjs
```

La verificación controla la sintaxis del JavaScript, la consistencia del destinatario y que el sitio no intente transmitir datos personales mediante una llamada automática.

## Privacidad

Los datos se mantienen únicamente en la pestaña abierta. No se almacenan en GitHub Pages ni se envían a servicios de terceros desde el código de la plataforma.
