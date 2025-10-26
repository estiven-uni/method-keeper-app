import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DragDropModule, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { MetodosService } from '../../services/metodos.service';
import { DeepseekService } from '../../services/deepseek.service';
import { Metodo } from '../../models/metodo.interface';
import { FormatoTextoPipe } from '../../pipes/formato-texto.pipe';
import { ConfiguracionDialogoComponent } from '../configuracion-dialogo/configuracion-dialogo.component';

@Component({
  selector: 'app-formulario-metodo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    DragDropModule,
    FormatoTextoPipe
  ],
  templateUrl: './formulario-metodo.component.html',
  styleUrl: './formulario-metodo.component.css'
})
export class FormularioMetodoComponent implements OnInit {
  modoEdicion = false;
  metodoId: string | null = null;
  
  titulo = '';
  descripcion = '';
  imagenUrl = '';
  videoUrl = '';
  pasosPrevios: string[] = [];
  pasosPrincipales: string[] = [];
  notas = '';
  etiquetas: string[] = [];
  activo = true;

  nuevoPasoPrevio = '';
  nuevoPasoPrincipal = '';
  nuevaEtiqueta = '';

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  archivoSeleccionado: File | null = null;
  
  // Control de edición de pasos
  pasoEditandoIndex: number | null = null;
  pasoEditandoTipo: 'previo' | 'principal' | null = null;
  pasoEditandoTexto: string = '';


  // Tamaño de vista previa de imagen (porcentaje 0-100)
  tamanoVistaPrevia: number = 100;
  
  // Controlar si la imagen se muestra completa en la tarjeta de la lista
  imagenCompleta: boolean = false;
  
  // Color de fondo de la imagen
  fondoImagen: string = 'gray';
  
  // Colores de fondo disponibles
  coloresFondo = [
    { valor: 'white', nombre: 'Blanco', clase: 'bg-white' },
    { valor: 'gray', nombre: 'Gris Claro', clase: 'bg-gray-100' },
    { valor: 'dark', nombre: 'Gris Oscuro', clase: 'bg-gray-700' },
    { valor: 'blue', nombre: 'Azul Pastel', clase: 'bg-blue-100' },
    { valor: 'pink', nombre: 'Rosa Pastel', clase: 'bg-pink-100' },
    { valor: 'green', nombre: 'Verde Pastel', clase: 'bg-green-100' },
    { valor: 'yellow', nombre: 'Amarillo Pastel', clase: 'bg-yellow-100' },
    { valor: 'purple', nombre: 'Morado Pastel', clase: 'bg-purple-100' },
    { valor: 'orange', nombre: 'Naranja Pastel', clase: 'bg-orange-100' }
  ];

  constructor(
    private metodosService: MetodosService,
    private deepseekService: DeepseekService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.metodoId = this.route.snapshot.paramMap.get('id');
    if (this.metodoId) {
      this.modoEdicion = true;
      this.cargarMetodo(this.metodoId);
    }
  }

  cargarMetodo(id: string) {
    const metodo = this.metodosService.getMetodoById(id);
    if (metodo) {
      this.titulo = metodo.titulo;
      this.descripcion = metodo.descripcion;
      this.imagenUrl = metodo.imagenUrl || '';
      this.videoUrl = metodo.videoUrl || '';
      this.tamanoVistaPrevia = metodo.tamanoImagen || 100;
      this.imagenCompleta = metodo.imagenCompleta !== undefined ? metodo.imagenCompleta : false;
      this.fondoImagen = metodo.fondoImagen || 'gray';
      this.pasosPrevios = [...metodo.pasosPrevios];
      this.pasosPrincipales = [...metodo.pasosPrincipales];
      this.notas = metodo.notas;
      this.etiquetas = [...metodo.etiquetas];
      this.activo = metodo.activo !== undefined ? metodo.activo : true;
    } else {
      this.snackBar.open('Método no encontrado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    }
  }

  agregarPasoPrevio() {
    if (this.nuevoPasoPrevio.trim()) {
      this.pasosPrevios.push(this.nuevoPasoPrevio.trim());
      this.nuevoPasoPrevio = '';
    }
  }

  eliminarPasoPrevio(index: number) {
    this.pasosPrevios.splice(index, 1);
  }

  iniciarEdicionPasoPrevio(index: number) {
    this.pasoEditandoIndex = index;
    this.pasoEditandoTipo = 'previo';
    this.pasoEditandoTexto = this.pasosPrevios[index];
  }

  guardarEdicionPasoPrevio() {
    if (this.pasoEditandoIndex !== null && this.pasoEditandoTexto.trim()) {
      this.pasosPrevios[this.pasoEditandoIndex] = this.pasoEditandoTexto.trim();
      this.cancelarEdicion();
    }
  }

  agregarPasoPrincipal() {
    if (this.nuevoPasoPrincipal.trim()) {
      this.pasosPrincipales.push(this.nuevoPasoPrincipal.trim());
      this.nuevoPasoPrincipal = '';
    }
  }

  eliminarPasoPrincipal(index: number) {
    this.pasosPrincipales.splice(index, 1);
  }

  iniciarEdicionPasoPrincipal(index: number) {
    this.pasoEditandoIndex = index;
    this.pasoEditandoTipo = 'principal';
    this.pasoEditandoTexto = this.pasosPrincipales[index];
  }

  guardarEdicionPasoPrincipal() {
    if (this.pasoEditandoIndex !== null && this.pasoEditandoTexto.trim()) {
      this.pasosPrincipales[this.pasoEditandoIndex] = this.pasoEditandoTexto.trim();
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.pasoEditandoIndex = null;
    this.pasoEditandoTipo = null;
    this.pasoEditandoTexto = '';
  }

  estaEditando(index: number, tipo: 'previo' | 'principal'): boolean {
    return this.pasoEditandoIndex === index && this.pasoEditandoTipo === tipo;
  }

  agregarEtiqueta() {
    if (this.nuevaEtiqueta.trim() && !this.etiquetas.includes(this.nuevaEtiqueta.trim())) {
      this.etiquetas.push(this.nuevaEtiqueta.trim());
      this.nuevaEtiqueta = '';
    }
  }

  eliminarEtiqueta(etiqueta: string) {
    const index = this.etiquetas.indexOf(etiqueta);
    if (index >= 0) {
      this.etiquetas.splice(index, 1);
    }
  }

  guardar() {
    if (!this.titulo.trim()) {
      this.snackBar.open('El título es obligatorio', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.pasosPrincipales.length === 0) {
      this.snackBar.open('Debe agregar al menos un paso principal', 'Cerrar', { duration: 3000 });
      return;
    }

    const metodoData = {
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim(),
      imagenUrl: this.imagenUrl.trim(),
      videoUrl: this.videoUrl.trim(),
      tamanoImagen: this.tamanoVistaPrevia,
      imagenCompleta: this.imagenCompleta,
      fondoImagen: this.fondoImagen,
      pasosPrevios: this.pasosPrevios,
      pasosPrincipales: this.pasosPrincipales,
      notas: this.notas.trim(),
      etiquetas: this.etiquetas,
      activo: this.activo
    };

    if (this.modoEdicion && this.metodoId) {
      this.metodosService.actualizarMetodo(this.metodoId, metodoData);
      this.snackBar.open('Método actualizado correctamente', 'Cerrar', { duration: 3000 });
    } else {
      this.metodosService.crearMetodo(metodoData);
      this.snackBar.open('Método creado correctamente', 'Cerrar', { duration: 3000 });
    }

    this.router.navigate(['/']);
  }

  cancelar() {
    this.router.navigate(['/']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/json') {
      this.archivoSeleccionado = file;
      this.cargarDesdeJSON(file);
    } else {
      this.snackBar.open('Por favor selecciona un archivo JSON válido', 'Cerrar', { duration: 3000 });
    }
  }

  cargarDesdeJSON(file: File) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        const contenido = JSON.parse(e.target.result);
        
        // Validar que tenga los campos requeridos
        if (!contenido.titulo || !contenido.pasosPrincipales || contenido.pasosPrincipales.length === 0) {
          this.snackBar.open('El JSON debe contener al menos: titulo y pasosPrincipales', 'Cerrar', { 
            duration: 5000 
          });
          return;
        }

        // Cargar los datos del JSON al formulario
        this.titulo = contenido.titulo || '';
        this.descripcion = contenido.descripcion || '';
        this.imagenUrl = contenido.imagenUrl || '';
        this.videoUrl = contenido.videoUrl || '';
        this.tamanoVistaPrevia = contenido.tamanoImagen || 100;
        this.imagenCompleta = contenido.imagenCompleta !== undefined ? contenido.imagenCompleta : false;
        this.fondoImagen = contenido.fondoImagen || 'gray';
        this.pasosPrevios = Array.isArray(contenido.pasosPrevios) ? contenido.pasosPrevios : [];
        this.pasosPrincipales = Array.isArray(contenido.pasosPrincipales) ? contenido.pasosPrincipales : [];
        this.notas = contenido.notas || '';
        this.etiquetas = Array.isArray(contenido.etiquetas) ? contenido.etiquetas : [];
        this.activo = contenido.activo !== undefined ? contenido.activo : true;

        this.snackBar.open('Método cargado desde JSON correctamente', 'Cerrar', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
      } catch (error) {
        this.snackBar.open('Error al procesar el archivo JSON. Verifica el formato.', 'Cerrar', { 
          duration: 5000 
        });
      }
    };

    reader.onerror = () => {
      this.snackBar.open('Error al leer el archivo', 'Cerrar', { duration: 3000 });
    };

    reader.readAsText(file);
  }

  limpiarFormulario() {
    this.titulo = '';
    this.descripcion = '';
    this.imagenUrl = '';
    this.videoUrl = '';
    this.tamanoVistaPrevia = 100;
    this.imagenCompleta = false;
    this.fondoImagen = 'gray';
    this.pasosPrevios = [];
    this.pasosPrincipales = [];
    this.notas = '';
    this.etiquetas = [];
    this.activo = true;
    this.archivoSeleccionado = null;
  }

  onDropPasosPrevios(event: any) {
    moveItemInArray(this.pasosPrevios, event.previousIndex, event.currentIndex);
  }

  onDropPasosPrincipales(event: any) {
    moveItemInArray(this.pasosPrincipales, event.previousIndex, event.currentIndex);
  }

}
