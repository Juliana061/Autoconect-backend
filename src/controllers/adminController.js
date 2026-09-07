const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');

// Lista todos los usuarios registrados (sin contraseña)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json(users);
};

// Lista todos los vehículos de todos los usuarios, con el dueño incluido
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

// Resumen general para el dashboard de administrador
exports.getSummary = async (req, res) => {
  const [totalUsers, totalVehicles, totalDocuments, vencidos] = await Promise.all([
    User.countDocuments(),
    Vehicle.countDocuments(),
    Document.countDocuments(),
    Document.countDocuments({ fechaVencimiento: { $lt: new Date() } }),
  ]);
  res.json({ totalUsers, totalVehicles, totalDocuments, vencidos });
};
