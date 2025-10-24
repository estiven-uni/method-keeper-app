export interface Metodo {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  pasosPrevios: string[];
  pasosPrincipales: string[];
  notas: string;
  etiquetas: string[];
  fechaCreacion: string;
  ultimaModificacion: string;
  activo: boolean;
}

