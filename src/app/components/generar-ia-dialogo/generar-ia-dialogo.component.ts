import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeepseekService } from '../../services/deepseek.service';
import { MetodosService } from '../../services/metodos.service';
import { ConfiguracionDialogoComponent } from '../configuracion-dialogo/configuracion-dialogo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-generar-ia-dialogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
      <div class="flex items-center gap-2">
        <mat-icon class="text-purple-600 dark:text-purple-400">auto_awesome</mat-icon>
        Generar Método con IA
      </div>
      <button mat-icon-button (click)="cerrar()" [disabled]="generando">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content class="mat-typography">
      <mat-form-field class="w-full mb-4" appearance="fill" subscriptSizing="dynamic">
        <mat-label>Describe el método que deseas crear</mat-label>
        <textarea 
          matInput 
          [(ngModel)]="prompt"
          rows="4"          
          [disabled]="generando"></textarea>
        <mat-hint>Sé específico para obtener mejores resultados</mat-hint>
      </mat-form-field>

      @if (generando) {
        <div class="flex flex-col items-center justify-center py-4 gap-3">
          <mat-spinner diameter="40"></mat-spinner>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ⏳ Generando método con IA... Esto puede tardar unos segundos
          </p>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gap-2">
      <button 
        mat-stroked-button 
        (click)="cerrar()"
        [disabled]="generando">
        Cancelar
      </button>
      <button 
        mat-raised-button 
        color="primary"
        (click)="generar()"
        [disabled]="generando || !prompt.trim()">
        @if (generando) {
          <mat-spinner diameter="20" class="inline-block mr-2"></mat-spinner>
          <span>Generando...</span>
        } @else {
          <mat-icon>auto_awesome</mat-icon>
          <span>Generar Método</span>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-dialog-container {
      max-height: 90vh;
    }

    :host ::ng-deep .mat-mdc-dialog-content {
      max-height: calc(90vh - 180px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0 24px;
    }

    :host ::ng-deep .mat-mdc-dialog-title {
      padding: 20px 24px 0;
      margin: 0;
    }

    :host ::ng-deep .mat-mdc-dialog-actions {
      padding: 12px 24px;
      min-height: 52px;
    }
  `]
})
export class GenerarIaDialogoComponent {
  prompt = '';
  generando = false;

  constructor(
    private dialogRef: MatDialogRef<GenerarIaDialogoComponent>,
    private deepseekService: DeepseekService,
    private metodosService: MetodosService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  generar() {
    if (!this.prompt.trim()) {
      return;
    }

    // Verificar si el API Key está configurado ANTES de intentar generar
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (!apiKey) {
      const snackBarRef = this.snackBar.open(
        'Para usar la IA debes configurar tu API Key de Deepseek', 
        'Configurar', 
        { duration: 8000 }
      );
      
      snackBarRef.onAction().subscribe(() => {
        this.dialog.open(ConfiguracionDialogoComponent, {
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          autoFocus: false,
          restoreFocus: false
        });
      });
      return;
    }

    this.generando = true;

    this.deepseekService.generarMetodo(this.prompt).subscribe({
      next: (metodoGenerado) => {
        // Crear el método directamente
        const metodoData: any = {
          titulo: metodoGenerado.titulo || '',
          descripcion: metodoGenerado.descripcion || '',
          imagenUrl: metodoGenerado.imagenUrl || '',
          videoUrl: metodoGenerado.videoUrl || '',
          tamanoImagen: metodoGenerado.tamanoImagen || 100,
          imagenCompleta: metodoGenerado.imagenCompleta !== undefined ? metodoGenerado.imagenCompleta : false,
          fondoImagen: metodoGenerado.fondoImagen || 'gray',
          pasosPrevios: Array.isArray(metodoGenerado.pasosPrevios) ? metodoGenerado.pasosPrevios : [],
          pasosPrincipales: Array.isArray(metodoGenerado.pasosPrincipales) ? metodoGenerado.pasosPrincipales : [],
          notas: metodoGenerado.notas || '',
          etiquetas: Array.isArray(metodoGenerado.etiquetas) ? metodoGenerado.etiquetas : [],
          activo: metodoGenerado.activo !== undefined ? metodoGenerado.activo : true
        };

        if (metodoGenerado.fechaExpiracion) {
          metodoData.fechaExpiracion = metodoGenerado.fechaExpiracion;
        }

        // Guardar el método
        const nuevoMetodo = this.metodosService.crearMetodo(metodoData);

        this.generando = false;
        this.snackBar.open('✨ Método generado con IA exitosamente', 'Ver', { 
          duration: 5000
        }).onAction().subscribe(() => {
          this.router.navigate(['/metodo', nuevoMetodo.id]);
        });

        // Cerrar el diálogo
        this.dialogRef.close();
      },
      error: (error) => {
        this.generando = false;
        
        // Mostrar error al usuario
        const mensajeError = error?.message || 'Error al generar el método con IA. Intenta de nuevo.';
        this.snackBar.open(mensajeError, 'Cerrar', { 
          duration: 5000 
        });
      }
    });
  }

  cerrar() {
    if (!this.generando) {
      this.dialogRef.close();
    }
  }
}

