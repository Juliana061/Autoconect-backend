const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placa: { type: String, required: true, uppercase: true, trim: true },
    marca: { type: String, trim: true },
    modelo: { type: String, trim: true },
    anio: { type: Number },
  },
  { timestamps: true }
);

vehicleSchema.index({ owner: 1, placa: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
