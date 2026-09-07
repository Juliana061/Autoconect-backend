const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');

exports.createVehicle = async (req, res) => {
  try {
    const { placa, marca, modelo, anio } = req.body;
    const vehicle = await Vehicle.create({ owner: req.user.id, placa, marca, modelo, anio });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Ya registraste un vehículo con esa placa' });
    res.status(500).json({ message: 'Error al crear vehículo', error: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user.id }).sort('-createdAt');
  res.json(vehicles);
};

exports.getVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user.id });
  if (!vehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
  const documents = await Document.find({ vehicle: vehicle._id }).sort('fechaVencimiento');
  res.json({ vehicle, documents });
};

exports.updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!vehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
  res.json(vehicle);
};

exports.deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!vehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
  await Document.deleteMany({ vehicle: vehicle._id });
  res.json({ message: 'Vehículo eliminado' });
};
