export interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  role: 'user' | 'gestor' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Vehicle {
  _id: string;
  placa: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  owner?: string | User;
}

export type TipoDocumento = 'SOAT' | 'Tecnomecanica' | 'Licencia' | 'Tarjeta_Propiedad' | 'Otro';
export type EstadoDocumento = 'vigente' | 'por_vencer' | 'vencido';

export interface VehicleDocument {
  _id: string;
  vehicle: string | Vehicle;
  tipo: TipoDocumento;
  numero?: string;
  fechaExpedicion?: string;
  fechaVencimiento: string;
  archivoUrl: string;
  archivoNombre?: string;
  estado: EstadoDocumento;
  validado?: boolean;
  owner?: string | User;
}
