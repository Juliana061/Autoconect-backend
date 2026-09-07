const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');

// Lista todos los vehículos de todos los usuarios (solo lectura, para contexto)
exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().populate('owner', 'nombre email telefono').sort('-createdAt');
  res.json(vehicles);
};

// Lista todos los documentos de todos los usuarios, con vehículo y dueño incluidos
exports.getAllDocuments = async (req, res) => {
  const documents = await Document.find()
    .populate('vehicle', 'placa marca modelo')
    .populate('owner', 'nombre email telefono')
    .sort('-createdAt');
  res.json(documents);
};

// Marca (o desmarca) un documento como validado por el gestor/admin actual
exports.setValidado = async (req, res) => {
  const { validado } = req.body;
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });

  doc.validado = !!validado;
  doc.validadoPor = doc.validado ? req.user.id : undefined;
  doc.validadoEn = doc.validado ? new Date() : undefined;
  await doc.save();

  const populated = await doc.populate([
    { path: 'vehicle', select: 'placa marca modelo' },
    { path: 'owner', select: 'nombre email telefono' },
  ]);
  res.json(populated);
};

// Resumen para el panel de gestor
exports.getSummary = async (req, res) => {
  const [totalDocuments, validados, pendientes, vencidos] = await Promise.all([
    Document.countDocuments(),
    Document.countDocuments({ validado: true }),
    Document.countDocuments({ validado: false }),
    Document.countDocuments({ fechaVencimiento: { $lt: new Date() } }),
  ]);
  res.json({ totalDocuments, validados, pendientes, vencidos });
};
