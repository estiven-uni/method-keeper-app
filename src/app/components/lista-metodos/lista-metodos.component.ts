import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MetodosService } from '../../services/metodos.service';
import { Metodo } from '../../models/metodo.interface';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';

@Component({
  selector: 'app-lista-metodos',
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
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './lista-metodos.component.html',
  styleUrl: './lista-metodos.component.css'
})
export class ListaMetodosComponent implements OnInit {
  metodos: Metodo[] = [];
  metodosFiltrados: Metodo[] = [];
  terminoBusqueda = '';
  ordenSeleccionado: 'asc' | 'desc' = 'desc';

  constructor(
    private metodosService: MetodosService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarMetodos();
    this.metodosService.metodos$.subscribe(() => {
      this.cargarMetodos();
    });
  }

  cargarMetodos() {
    this.metodos = this.metodosService.ordenarPorFecha(this.ordenSeleccionado);
    this.filtrarMetodos();
  }

  filtrarMetodos() {
    if (!this.terminoBusqueda.trim()) {
      this.metodosFiltrados = [...this.metodos];
    } else {
      this.metodosFiltrados = this.metodosService.buscarMetodos(this.terminoBusqueda);
    }
  }

  onBusquedaCambio() {
    this.filtrarMetodos();
  }

  onOrdenCambio() {
    this.cargarMetodos();
  }

  nuevoMetodo() {
    this.router.navigate(['/nuevo']);
  }

  verDetalle(id: string) {
    this.router.navigate(['/ver', id]);
  }

  editarMetodo(id: string, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/editar', id]);
  }

  eliminarMetodo(metodo: Metodo, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '350px',
      data: {
        titulo: '¿Eliminar método?',
        mensaje: `¿Estás seguro de que deseas eliminar "${metodo.titulo}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.metodosService.eliminarMetodo(metodo.id);
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
