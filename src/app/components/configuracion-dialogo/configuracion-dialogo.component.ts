import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-configuracion-dialogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './configuracion-dialogo.component.html',
  styleUrls: ['./configuracion-dialogo.component.css']
})
export class ConfiguracionDialogoComponent implements OnInit {
  apiKey: string = '';
  mostrarApiKey: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ConfiguracionDialogoComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar el API key desde localStorage si existe
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
  }

  toggleMostrarApiKey(): void {
    this.mostrarApiKey = !this.mostrarApiKey;
  }

  guardar(): void {
    if (this.apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', this.apiKey.trim());
      this.snackBar.open('✅ API Key guardada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(true);
    } else {
      this.snackBar.open('⚠️ Por favor ingresa un API Key válido', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  eliminar(): void {
    localStorage.removeItem('deepseek_api_key');
    this.apiKey = '';
    this.snackBar.open('🗑️ API Key eliminada', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

