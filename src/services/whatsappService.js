const axios = require('axios');

const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

const client = axios.create({
  baseURL: `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}`,
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
});

/**
 * Envía un mensaje de texto simple por WhatsApp Cloud API.
 * @param {string} to - Número en formato E.164 sin '+' (ej: 573001234567)
 * @param {string} body - Texto del mensaje
 */
async function sendText(to, body) {
  try {
    await client.post('/messages', {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    });
  } catch (err) {
    console.error('Error enviando mensaje de WhatsApp:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendText };
