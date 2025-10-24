export interface Metodo {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  tamanoImagen?: number; // Tamaño en porcentaje (0-100)
  pasosPrevios: string[];
  pasosPrincipales: string[];
  notas: string;
  etiquetas: string[];
  fechaCreacion: string;
  ultimaModificacion: string;
  activo: boolean;
}

