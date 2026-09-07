const mongoose = require('mongoose');

const TIPOS_DOCUMENTO = ['SOAT', 'Tecnomecanica', 'Licencia', 'Tarjeta_Propiedad', 'Otro'];

const documentSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: TIPOS_DOCUMENTO, required: true },
    numero: { type: String, trim: true },
    fechaExpedicion: { type: Date },
    fechaVencimiento: { type: Date, required: true },
    archivoUrl: { type: String, required: true },
    archivoNombre: { type: String },
    alertaEnviada: { type: Boolean, default: false },
    validado: { type: Boolean, default: false },
    validadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validadoEn: { type: Date },
  },
  { timestamps: true }
);

// Estado virtual calculado dinámicamente: vigente | por_vencer | vencido
documentSchema.virtual('estado').get(function () {
  const hoy = new Date();
  const dias = Math.ceil((this.fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
  if (dias < 0) return 'vencido';
  if (dias <= 30) return 'por_vencer';
  return 'vigente';
});

documentSchema.set('toJSON', { virtuals: true });
documentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
module.exports.TIPOS_DOCUMENTO = TIPOS_DOCUMENTO;
