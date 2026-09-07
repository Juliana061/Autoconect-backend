const cron = require('node-cron');
const Document = require('../models/Document');
const { sendText } = require('./whatsappService');

const TIPO_LABEL = {
  SOAT: 'SOAT',
  Tecnomecanica: 'Tecnomecánica',
  Licencia: 'Licencia de conducción',
  Tarjeta_Propiedad: 'Tarjeta de propiedad',
  Otro: 'Documento',
};

async function checkAndSendAlerts() {
  const hoy = new Date();
  const en30dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);

  const documentos = await Document.find({
    fechaVencimiento: { $lte: en30dias },
    alertaEnviada: false,
  })
    .populate('vehicle', 'placa')
    .populate('owner', 'nombre telefono');

  for (const doc of documentos) {
    if (!doc.owner?.telefono) continue;
    const dias = Math.ceil((doc.fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    const estadoTexto = dias < 0 ? `venció hace ${Math.abs(dias)} día(s)` : `vence en ${dias} día(s)`;
    const mensaje =
      `⚠️ Hola ${doc.owner.nombre}, tu documento ${TIPO_LABEL[doc.tipo] || doc.tipo} ` +
      `del vehículo ${doc.vehicle?.placa || ''} ${estadoTexto} ` +
      `(${new Date(doc.fechaVencimiento).toLocaleDateString('es-CO')}). ` +
      `Por favor gestiona su renovación en AutoConnect.`;

    try {
      await sendText(doc.owner.telefono, mensaje);
      doc.alertaEnviada = true;
      await doc.save();
      console.log(`Alerta enviada a ${doc.owner.telefono} por documento ${doc._id}`);
    } catch (err) {
      console.error(`No se pudo enviar alerta para documento ${doc._id}:`, err.message);
    }
  }
}

// Corre todos los días a las 8:00 a.m.
function startAlertScheduler() {
  cron.schedule('0 8 * * *', () => {
    console.log('Ejecutando verificación de documentos por vencer...');
    checkAndSendAlerts();
  });
}

module.exports = { startAlertScheduler, checkAndSendAlerts };
