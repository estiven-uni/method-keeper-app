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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { JsonbinService } from '../../services/jsonbin.service';
import { MetodosService } from '../../services/metodos.service';

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
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './configuracion-dialogo.component.html',
  styleUrls: ['./configuracion-dialogo.component.css']
})
export class ConfiguracionDialogoComponent implements OnInit {
  // Deepseek IA
  apiKey: string = '';
  mostrarApiKey: boolean = false;

  // JSONBin Sync
  jsonbinApiKey: string = '';
  jsonbinBinId: string = '';
  mostrarJsonbinApiKey: boolean = false;
  sincronizando: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ConfiguracionDialogoComponent>,
    private snackBar: MatSnackBar,
    private jsonbinService: JsonbinService,
    private metodosService: MetodosService
  ) {}

  ngOnInit(): void {
    // Cargar el API key de Deepseek
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }

    // Cargar configuración de JSONBin
    const savedJsonbinApiKey = localStorage.getItem('jsonbin_api_key');
    if (savedJsonbinApiKey) {
      this.jsonbinApiKey = savedJsonbinApiKey;
    }

    const savedBinId = localStorage.getItem('jsonbin_bin_id');
    if (savedBinId) {
      this.jsonbinBinId = savedBinId;
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

  toggleMostrarJsonbinApiKey(): void {
    this.mostrarJsonbinApiKey = !this.mostrarJsonbinApiKey;
  }

  guardarJsonbin(): void {
    if (this.jsonbinApiKey.trim()) {
      localStorage.setItem('jsonbin_api_key', this.jsonbinApiKey.trim());
      
      if (this.jsonbinBinId.trim()) {
        localStorage.setItem('jsonbin_bin_id', this.jsonbinBinId.trim());
      }

      this.snackBar.open('✅ Configuración de JSONBin guardada', 'Cerrar', {
        duration: 3000
      });
    } else {
      this.snackBar.open('⚠️ Por favor ingresa un API Key de JSONBin válido', 'Cerrar', {
        duration: 3000
      });
    }
  }

  eliminarJsonbin(): void {
    localStorage.removeItem('jsonbin_api_key');
    localStorage.removeItem('jsonbin_bin_id');
    this.jsonbinApiKey = '';
    this.jsonbinBinId = '';
    this.snackBar.open('🗑️ Configuración de JSONBin eliminada', 'Cerrar', {
      duration: 3000
    });
  }

  // Sincronización
  subirANube(): void {
    if (!this.jsonbinApiKey.trim()) {
      this.snackBar.open('⚠️ Primero configura tu API Key de JSONBin', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.sincronizando = true;
    const metodos = this.metodosService.getTodosLosMetodos();

    this.jsonbinService.pushData(metodos).subscribe({
      next: (response) => {
        this.sincronizando = false;
        
        // Si se creó un nuevo bin, actualizar el campo
        if (response.binId && !this.jsonbinBinId) {
          this.jsonbinBinId = response.binId;
        }

        this.snackBar.open(`📤 ${response.message}`, 'Cerrar', {
          duration: 4000
        });
      },
      error: (error) => {
        this.sincronizando = false;
        this.snackBar.open(`❌ ${error.message}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  descargarDeNube(): void {
    if (!this.jsonbinApiKey.trim()) {
      this.snackBar.open('⚠️ Primero configura tu API Key de JSONBin', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (!this.jsonbinBinId.trim()) {
      this.snackBar.open('⚠️ Debes ingresar un Bin ID o primero subir datos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.sincronizando = true;

    this.jsonbinService.pullData().subscribe({
      next: (data) => {
        this.sincronizando = false;

        // Reemplazar métodos locales con los de la nube
        localStorage.setItem('metodos', JSON.stringify(data.metodos));
        
        // Recargar la página para refrescar la lista
        window.location.reload();
      },
      error: (error) => {
        this.sincronizando = false;
        this.snackBar.open(`❌ ${error.message}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  sincronizarBidireccional(): void {
    if (!this.jsonbinApiKey.trim() || !this.jsonbinBinId.trim()) {
      this.snackBar.open('⚠️ Configura API Key y Bin ID para sincronizar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.sincronizando = true;

    // Primero descargar de la nube
    this.jsonbinService.pullData().subscribe({
      next: (dataNube) => {
        const metodosLocales = this.metodosService.getTodosLosMetodos();
        
        // Merge: combinar ambos sin duplicados (por ID)
        const metodosMap = new Map();
        
        // Primero agregar los de la nube
        dataNube.metodos.forEach(m => metodosMap.set(m.id, m));
        
        // Luego agregar/actualizar con los locales
        metodosLocales.forEach(m => {
          const existente = metodosMap.get(m.id);
          if (!existente || new Date(m.ultimaModificacion) > new Date(existente.ultimaModificacion)) {
            metodosMap.set(m.id, m);
          }
        });

        const metodosSincronizados = Array.from(metodosMap.values());

        // Guardar localmente
        localStorage.setItem('metodos', JSON.stringify(metodosSincronizados));

        // Subir a la nube
        this.jsonbinService.pushData(metodosSincronizados).subscribe({
          next: () => {
            this.sincronizando = false;
            this.snackBar.open('🔄 Sincronización bidireccional completada', 'Cerrar', {
              duration: 4000
            });
            
            // Recargar para mostrar cambios
            window.location.reload();
          },
          error: (error) => {
            this.sincronizando = false;
            this.snackBar.open(`❌ Error al subir: ${error.message}`, 'Cerrar', {
              duration: 5000
            });
          }
        });
      },
      error: (error) => {
        this.sincronizando = false;
        this.snackBar.open(`❌ ${error.message}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

