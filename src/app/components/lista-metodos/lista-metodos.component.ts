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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './lista-metodos.component.html',
  styleUrl: './lista-metodos.component.css'
})
export class ListaMetodosComponent implements OnInit {
  metodos: Metodo[] = [];
  metodosFiltrados: Metodo[] = [];
  metodosPaginados: Metodo[] = [];
  placeholders: number[] = [];
  terminoBusqueda = '';
  ordenSeleccionado: 'asc' | 'desc' = 'desc';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  
  pageSize = 6;
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24, 48];

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
    let resultados: Metodo[];
    
    if (!this.terminoBusqueda.trim()) {
      resultados = [...this.metodos];
    } else {
      resultados = this.metodosService.buscarMetodos(this.terminoBusqueda);
    }

    // Aplicar filtro de estado
    if (this.filtroEstado === 'activos') {
      resultados = resultados.filter(m => m.activo === true);
    } else if (this.filtroEstado === 'inactivos') {
      resultados = resultados.filter(m => m.activo === false);
    }

    this.metodosFiltrados = resultados;
    this.pageIndex = 0;
    this.actualizarPaginacion();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.metodosPaginados = this.metodosFiltrados.slice(startIndex, endIndex);
    
    // Calcular placeholders para rellenar la grilla
    const itemsEnPagina = this.metodosPaginados.length;
    const placeholdersNecesarios = itemsEnPagina < this.pageSize ? this.pageSize - itemsEnPagina : 0;
    this.placeholders = Array(placeholdersNecesarios).fill(0);
  }

  onBusquedaCambio() {
    this.filtrarMetodos();
  }

  onOrdenCambio() {
    this.cargarMetodos();
  }

  onFiltroEstadoCambio() {
    this.filtrarMetodos();
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

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.ordenSeleccionado = 'desc';
    this.cargarMetodos();
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
