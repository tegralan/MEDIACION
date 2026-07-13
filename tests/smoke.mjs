import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);

assert.ok(inlineScript, 'Debe existir un script principal en línea');
assert.doesNotThrow(() => new Function(inlineScript[1]), 'El JavaScript debe tener sintaxis válida');

const configuredRecipient = html.match(/RECIPIENT_EMAIL\s*=\s*'([^']+)'/);
assert.ok(configuredRecipient, 'Debe existir un único destinatario configurable');
assert.match(configuredRecipient[1], /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El destinatario debe ser un correo válido');

const institutionalAddresses = [...html.matchAll(/[\w.+-]+@jusbaires\.gob\.ar/gi)].map((match) => match[0].toLowerCase());
assert.deepEqual([...new Set(institutionalAddresses)], [configuredRecipient[1].toLowerCase()], 'No debe haber destinatarios institucionales contradictorios');

assert.ok((html.match(/data-recipient/g) || []).length >= 2, 'La interfaz debe reutilizar el destinatario configurado');
assert.match(html, /id="btnMail"[^>]*>Preparar correo<\/button>/, 'El correo debe prepararse mediante un botón controlado');
assert.doesNotMatch(html, /fetch\s*\(|XMLHttpRequest|Reintentar envío|enviar automáticamente/i, 'El sitio estático no debe simular un envío automático');
assert.doesNotMatch(html, /chart\.js|new\s+Chart\s*\(/i, 'No deben mostrarse estadísticas sin una fuente verificable');

console.log('Smoke tests: OK');
