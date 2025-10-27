export interface Metodo {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  tamanoImagen?: number; // Tamaño en porcentaje (0-100)
  imagenCompleta?: boolean; // true = llenar espacio (cover), false = mostrar completa (contain)
  fondoImagen?: string; // Color de fondo de la imagen
  videoUrl?: string; // URL del video tutorial (YouTube, Vimeo, etc.)
  pasosPrevios: string[];
  pasosPrincipales: string[];
  notas: string;
  etiquetas: string[];
  fechaCreacion: string;
  ultimaModificacion: string;
  activo: boolean;
  fechaExpiracion?: string; // Fecha de expiración del método (formato ISO)
}

