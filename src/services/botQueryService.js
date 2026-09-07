const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');
const { TIPOS_DOCUMENTO } = Document;

const ESTADO_LABEL = {
  vigente: '✅ Vigente',
  por_vencer: '⚠️ Por vencer (30 días o menos)',
  vencido: '❌ Vencido',
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // quita tildes
}

function detectTipo(textoNormalizado) {
  const map = {
    soat: 'SOAT',
    tecnomecanica: 'Tecnomecanica',
    tecno: 'Tecnomecanica',
    licencia: 'Licencia',
    tarjeta: 'Tarjeta_Propiedad',
    propiedad: 'Tarjeta_Propiedad',
  };
  for (const [kw, tipo] of Object.entries(map)) {
    if (textoNormalizado.includes(kw)) return tipo;
  }
  return null;
}

/**
 * Procesa un mensaje entrante de WhatsApp y devuelve el texto de respuesta.
 * @param {string} from - Número de teléfono del remitente (E.164 sin '+')
 * @param {string} text - Texto del mensaje recibido
 */
async function handleIncomingMessage(from, text) {
  const user = await User.findOne({ telefono: from }).lean();
  if (!user) {
    return (
      'Hola 👋, no encontramos tu número registrado en AutoConnect. ' +
      'Regístrate en la plataforma con este mismo número de WhatsApp para poder ayudarte.'
    );
  }

  const normalizado = normalize(text || '');

  if (normalizado.includes('hola') || normalizado.includes('ayuda') || normalizado.includes('menu')) {
    return (
      `Hola ${user.nombre} 👋, soy el asistente de AutoConnect.\n` +
      `Puedes preguntarme, por ejemplo:\n` +
      `- "estado de mi SOAT"\n- "estado de mi tecnomecánica"\n- "estado de mi licencia"\n` +
      `También te avisaré automáticamente cuando un documento esté por vencer.`
    );
  }

  const tipo = detectTipo(normalizado);
  if (!tipo) {
    return (
      'No entendí tu mensaje 🤔. Prueba preguntando, por ejemplo: "estado de mi SOAT" ' +
      'o "estado de mi tecnomecánica".'
    );
  }

  const vehicles = await Vehicle.find({ owner: user._id }).lean();
  if (vehicles.length === 0) {
    return 'Aún no tienes vehículos registrados en AutoConnect.';
  }

  const vehicleIds = vehicles.map((v) => v._id);
  const documents = await Document.find({ vehicle: { $in: vehicleIds }, tipo })
    .sort('-fechaVencimiento')
    .lean();

  if (documents.length === 0) {
    return `No tienes ningún documento de tipo ${tipo.replace('_', ' ')} registrado todavía.`;
  }

  const vehicleMap = Object.fromEntries(vehicles.map((v) => [String(v._id), v]));

  const lineas = documents.map((doc) => {
    const hoy = new Date();
    const dias = Math.ceil((new Date(doc.fechaVencimiento) - hoy) / (1000 * 60 * 60 * 24));
    const estado = dias < 0 ? 'vencido' : dias <= 30 ? 'por_vencer' : 'vigente';
    const vehiculo = vehicleMap[String(doc.vehicle)];
    const fecha = new Date(doc.fechaVencimiento).toLocaleDateString('es-CO');
    return `🚗 ${vehiculo?.placa || 'N/A'} — ${ESTADO_LABEL[estado]} (vence: ${fecha})`;
  });

  return `Estado de tu(s) documento(s) de ${tipo.replace('_', ' ')}:\n${lineas.join('\n')}`;
}

module.exports = { handleIncomingMessage };
