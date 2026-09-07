const path = require('path');
const Document = require('../models/Document');
const Vehicle = require('../models/Vehicle');

exports.uploadDocument = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { tipo, numero, fechaExpedicion, fechaVencimiento } = req.body;

    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: req.user.id });
    if (!vehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });

    if (!req.file) return res.status(400).json({ message: 'Debes adjuntar el archivo del documento' });
    if (!tipo || !fechaVencimiento) {
      return res.status(400).json({ message: 'Tipo y fecha de vencimiento son obligatorios' });
    }

    const document = await Document.create({
      vehicle: vehicle._id,
      owner: req.user.id,
      tipo,
      numero,
      fechaExpedicion,
      fechaVencimiento,
      archivoUrl: `/uploads/${req.file.filename}`,
      archivoNombre: req.file.originalname,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ message: 'Error al subir documento', error: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  const filter = { owner: req.user.id };
  if (req.query.vehicleId) filter.vehicle = req.query.vehicleId;
  if (req.query.tipo) filter.tipo = req.query.tipo;
  const documents = await Document.find(filter).populate('vehicle', 'placa marca modelo').sort('fechaVencimiento');
  res.json(documents);
};

exports.getDocument = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user.id }).populate('vehicle');
  if (!document) return res.status(404).json({ message: 'Documento no encontrado' });
  res.json(document);
};

exports.updateDocument = async (req, res) => {
  const { tipo, numero, fechaExpedicion, fechaVencimiento } = req.body;
  const document = await Document.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { tipo, numero, fechaExpedicion, fechaVencimiento, alertaEnviada: false },
    { new: true, runValidators: true }
  );
  if (!document) return res.status(404).json({ message: 'Documento no encontrado' });
  res.json(document);
};

exports.deleteDocument = async (req, res) => {
  const document = await Document.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!document) return res.status(404).json({ message: 'Documento no encontrado' });
  res.json({ message: 'Documento eliminado' });
};
