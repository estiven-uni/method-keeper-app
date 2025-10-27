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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatDividerModule,
    MatSlideToggleModule
  ],
  templateUrl: './configuracion-dialogo.component.html',
  styleUrls: ['./configuracion-dialogo.component.css']
})
export class ConfiguracionDialogoComponent implements OnInit {
  // Deepseek IA
  apiKey: string = '';

  // JSONBin Sync
  jsonbinApiKey: string = '';
  jsonbinBinId: string = '';
  sincronizando: boolean = false;
  modoDesarrollo: boolean = false;

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

    // Cargar modo desarrollo (por defecto false = producción)
    const savedModoDesarrollo = localStorage.getItem('modo_desarrollo');
    this.modoDesarrollo = savedModoDesarrollo === 'true';
  }

  guardar(): void {
    let cambios = false;

    // Guardar API Key de Deepseek
    if (this.apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', this.apiKey.trim());
      cambios = true;
    } else {
      localStorage.removeItem('deepseek_api_key');
    }

    // Guardar configuración de JSONBin
    if (this.jsonbinApiKey.trim()) {
      localStorage.setItem('jsonbin_api_key', this.jsonbinApiKey.trim());
      cambios = true;
      
      if (this.jsonbinBinId.trim()) {
        localStorage.setItem('jsonbin_bin_id', this.jsonbinBinId.trim());
      } else {
        localStorage.removeItem('jsonbin_bin_id');
      }
    } else {
      localStorage.removeItem('jsonbin_api_key');
      localStorage.removeItem('jsonbin_bin_id');
    }

    // NOTA: modo_desarrollo se guarda automáticamente con cambiarModoDesarrollo()
    // El botón guardar solo guarda API Keys y Bin ID

    if (cambios) {
      this.snackBar.open('✅ Configuración guardada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.dialogRef.close(true);
    } else {
      this.snackBar.open('⚠️ No hay cambios para guardar', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  // Sincronización
  sincronizarBidireccional(): void {
    if (!this.jsonbinApiKey.trim()) {
      this.snackBar.open('⚠️ Primero guarda tu API Key de JSONBin', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.sincronizando = true;

    // Si no hay Bin ID, solo subir los datos locales
    if (!this.jsonbinBinId.trim()) {
      const metodosLocales = this.metodosService.getTodosLosMetodos();
      
      this.jsonbinService.pushData(metodosLocales).subscribe({
        next: (response) => {
          this.sincronizando = false;
          
          // Guardar el nuevo Bin ID
          if (response.binId) {
            this.jsonbinBinId = response.binId;
            localStorage.setItem('jsonbin_bin_id', response.binId);
          }

          this.snackBar.open('🔄 Sincronización completada', 'Cerrar', {
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
      return;
    }

    // Si hay Bin ID, hacer sincronización bidireccional
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

        // Guardar localmente sin disparar sincronización automática
        this.metodosService.recargarMetodosSinSincronizar(metodosSincronizados);

        // Guardar configuración de la nube si existe
        if (dataNube.config) {
          if (dataNube.config.deepseekApiKey) {
            localStorage.setItem('deepseek_api_key', dataNube.config.deepseekApiKey);
            this.apiKey = dataNube.config.deepseekApiKey;
          }
          // NO sobrescribir modoDesarrollo - respeta la preferencia local
          // localStorage.setItem('modo_desarrollo', dataNube.config.modoDesarrollo.toString());
          // this.modoDesarrollo = dataNube.config.modoDesarrollo;
        }

        // Subir a la nube
        this.jsonbinService.pushData(metodosSincronizados).subscribe({
          next: () => {
            this.sincronizando = false;
            this.snackBar.open('✅ Sincronización completada', 'Cerrar', {
              duration: 4000
            });
            
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

  cambiarModoDesarrollo(nuevoValor: boolean): void {
    if (this.jsonbinApiKey.trim()) {
      const modoValue = nuevoValor.toString();
      localStorage.setItem('modo_desarrollo', modoValue);
      this.snackBar.open(`✅ Modo cambiado a ${nuevoValor ? 'Desarrollo' : 'Producción'}`, 'Cerrar', {
        duration: 2000
      });
    } else {
      this.modoDesarrollo = false;
      this.snackBar.open('⚠️ Debes guardar la API Key de JSONBin primero', 'Cerrar', {
        duration: 2000
      });
    }
  }

  pegarDelPortapapeles(campo: string): void {
    navigator.clipboard.readText().then((texto) => {
      if (campo === 'apiKey') {
        this.apiKey = texto;
      } else if (campo === 'jsonbinApiKey') {
        this.jsonbinApiKey = texto;
      } else if (campo === 'jsonbinBinId') {
        this.jsonbinBinId = texto;
      }
      this.snackBar.open('✅ Contenido pegado', 'Cerrar', {
        duration: 2000
      });
    }).catch(() => {
      this.snackBar.open('❌ Error al pegar. Verifica permisos del portapapeles', 'Cerrar', {
        duration: 2000
      });
    });
  }
}

