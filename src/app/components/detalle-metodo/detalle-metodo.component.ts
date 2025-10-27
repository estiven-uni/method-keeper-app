import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MetodosService } from '../../services/metodos.service';
import { Metodo } from '../../models/metodo.interface';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';
import { FormatoTextoPipe } from '../../pipes/formato-texto.pipe';

@Component({
  selector: 'app-detalle-metodo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    FormatoTextoPipe
  ],
  templateUrl: './detalle-metodo.component.html',
  styleUrl: './detalle-metodo.component.css'
})
export class DetalleMetodoComponent implements OnInit {
  metodo: Metodo | null = null;
  metodoId: string | null = null;

  constructor(
    private metodosService: MetodosService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.metodoId = this.route.snapshot.paramMap.get('id');
    if (this.metodoId) {
      this.cargarMetodo(this.metodoId);
    } else {
      this.router.navigate(['/']);
    }
  }

  cargarMetodo(id: string) {
    const metodo = this.metodosService.getMetodoById(id);
    if (metodo) {
      this.metodo = metodo;
    } else {
      this.router.navigate(['/']);
    }
  }

  volver() {
    this.router.navigate(['/']);
  }

  editar() {
    if (this.metodoId) {
      this.router.navigate(['/editar', this.metodoId]);
    }
  }

  eliminar() {
    if (!this.metodo) return;

    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '350px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: false,
      data: {
        titulo: '¿Eliminar método?',
        mensaje: `¿Estás seguro de que deseas eliminar "${this.metodo.titulo}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.metodoId) {
        this.metodosService.eliminarMetodo(this.metodoId);
        this.router.navigate(['/']);
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getVideoEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;

    let embedUrl = '';

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    // Si no es YouTube ni Vimeo, intentar usar la URL directamente
    if (url.includes('embed')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    return null;
  }

  obtenerEstado(metodo: Metodo): 'FUNCIONANDO' | 'INACTIVO' | 'EXPIRADO' {
    if (metodo.fechaExpiracion) {
      const ahora = new Date();
      const fechaExpiracion = new Date(metodo.fechaExpiracion);
      if (ahora > fechaExpiracion) {
        return 'EXPIRADO';
      }
    }
    return metodo.activo ? 'FUNCIONANDO' : 'INACTIVO';
  }

  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case 'FUNCIONANDO':
        return 'bg-green-600';
      case 'INACTIVO':
        return 'bg-red-600';
      case 'EXPIRADO':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  }
}
