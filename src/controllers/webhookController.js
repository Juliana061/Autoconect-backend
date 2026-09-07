const { sendText } = require('../services/whatsappService');
const { handleIncomingMessage } = require('../services/botQueryService');

// Verificación del webhook exigida por Meta (challenge-response)
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// Recepción de mensajes entrantes
exports.receiveMessage = async (req, res) => {
  // Responder rápido a Meta para evitar reintentos
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== 'text') return;

    const from = message.from; // número del remitente
    const text = message.text?.body || '';

    const respuesta = await handleIncomingMessage(from, text);
    await sendText(from, respuesta);
  } catch (err) {
    console.error('Error procesando mensaje entrante de WhatsApp:', err.message);
  }
};
