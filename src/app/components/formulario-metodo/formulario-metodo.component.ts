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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MetodosService } from '../../services/metodos.service';
import { Metodo } from '../../models/metodo.interface';

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
    MatSnackBarModule
  ],
  templateUrl: './formulario-metodo.component.html',
  styleUrl: './formulario-metodo.component.css'
})
export class FormularioMetodoComponent implements OnInit {
  modoEdicion = false;
  metodoId: string | null = null;
  
  titulo = '';
  descripcion = '';
  pasosPrevios: string[] = [];
  pasosPrincipales: string[] = [];
  notas = '';
  etiquetas: string[] = [];

  nuevoPasoPrevio = '';
  nuevoPasoPrincipal = '';
  nuevaEtiqueta = '';

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private metodosService: MetodosService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
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
      this.pasosPrevios = [...metodo.pasosPrevios];
      this.pasosPrincipales = [...metodo.pasosPrincipales];
      this.notas = metodo.notas;
      this.etiquetas = [...metodo.etiquetas];
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

  agregarPasoPrincipal() {
    if (this.nuevoPasoPrincipal.trim()) {
      this.pasosPrincipales.push(this.nuevoPasoPrincipal.trim());
      this.nuevoPasoPrincipal = '';
    }
  }

  eliminarPasoPrincipal(index: number) {
    this.pasosPrincipales.splice(index, 1);
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
      pasosPrevios: this.pasosPrevios,
      pasosPrincipales: this.pasosPrincipales,
      notas: this.notas.trim(),
      etiquetas: this.etiquetas
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
}
