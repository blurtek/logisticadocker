export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  address: string;
  material: string;
  documentNumber: string;
  transporter: string;
  scheduledDate: string;
  scheduledTime: string;
  customerObservations?: string;
  customerPhone: string;
  hasPickup: boolean;
  deliveredMaterials?: string;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export enum DeliveryStatus {
  PREPARACION = 'PREPARACION',
  TRANSITO = 'TRANSITO',
  REPARTO = 'REPARTO',
  ERROR_LLAMADA = 'ERROR_LLAMADA',
  AUSENTE = 'AUSENTE',
  ERROR_PEDIDO = 'ERROR_PEDIDO',
  COMPLETADO = 'COMPLETADO'
}

export interface DeliveryFormData {
  address: string;
  material: string;
  documentNumber: string;
  transporter: string;
  scheduledDate: string;
  scheduledTime: string;
  customerObservations?: string;
  customerPhone: string;
  hasPickup: boolean;
  deliveredMaterials?: string;
  status: DeliveryStatus;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SearchRequest {
  documentNumber: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
