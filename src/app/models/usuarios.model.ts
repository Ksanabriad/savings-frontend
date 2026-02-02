export interface PerfilUsuario {
  id: number;
  nombre: string;
}

export interface TipoFinanza {
  id: number;
  nombre: string;
}

export interface MedioPago {
  id: number;
  nombre: string;
}

export interface Usuario {
  username: string;
  email: string;
  password?: string;
  perfil?: PerfilUsuario;
  rol?: string; // Mantener temporalmente para compatibilidad si es necesario
}

export interface Concepto {
  id: number;
  nombre: string;
}

export interface Finanza {
  id: number;
  concepto: Concepto;
  fecha: string;
  cantidad: number;
  tipo: TipoFinanza;
  medio: MedioPago;
  file: string;
  usuario?: any;
}

export interface HistorialInforme {
  id: number;
  fechaGeneracion: string;
  nombreArchivo: string;
  usuario?: Usuario;
  finanzas?: Finanza[];
  contenido?: any;
}
