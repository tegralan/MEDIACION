import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const msalBundle = fs.readFileSync(new URL('../vendor/msal-browser.min.js', import.meta.url), 'utf8');
const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);

assert.ok(inlineScript, 'Debe existir un script principal en línea');
assert.doesNotThrow(() => new Function(inlineScript[1]), 'El JavaScript debe tener sintaxis válida');

const configuredRecipient = html.match(/RECIPIENT_EMAIL\s*=\s*'([^']+)'/);
assert.ok(configuredRecipient, 'Debe existir un único destinatario configurable');
assert.match(configuredRecipient[1], /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El destinatario debe ser un correo válido');

const institutionalAddresses = [...html.matchAll(/[\w.+-]+@jusbaires\.gob\.ar/gi)].map((match) => match[0].toLowerCase());
assert.deepEqual([...new Set(institutionalAddresses)], [configuredRecipient[1].toLowerCase()], 'No debe haber destinatarios institucionales contradictorios');

assert.ok((html.match(/data-recipient/g) || []).length >= 2, 'La interfaz debe reutilizar el destinatario configurado');
assert.match(html, /id="btnSend"[^>]*>Enviar solicitud<\/button>/, 'Debe existir un botón de envío directo');
assert.match(html, /https:\/\/graph\.microsoft\.com\/v1\.0\/me\/sendMail/, 'El envío debe usar Microsoft Graph');
assert.match(html, /saveToSentItems:\s*true/, 'El mensaje debe registrarse en Enviados');
assert.match(html, /GRAPH_SCOPES\s*=\s*\['User\.Read',\s*'Mail\.Send'\]/, 'MSAL debe solicitar únicamente los permisos esperados');
assert.match(html, /ENTRA_CLIENT_ID\s*=\s*'[0-9a-f-]{36}'/i, 'Debe existir un Client ID válido');
assert.match(html, /ENTRA_TENANT_ID\s*=\s*'[0-9a-f-]{36}'/i, 'Debe existir un Tenant ID válido');
assert.doesNotMatch(html, /client[_-]?secret|BEGIN (RSA )?PRIVATE KEY|smtpjs|emailjs|formspree/i, 'No deben existir secretos ni servicios de correo externos');
assert.match(msalBundle, /@azure\/msal-browser v5\.17\.0/, 'Debe usarse la versión aprobada de MSAL Browser');
assert.doesNotMatch(html, /chart\.js|new\s+Chart\s*\(/i, 'No deben mostrarse estadísticas sin una fuente verificable');

console.log('Smoke tests: OK');
