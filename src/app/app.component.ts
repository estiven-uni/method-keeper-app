import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { MetodosService } from './services/metodos.service';
import { JsonbinService } from './services/jsonbin.service';
import { ConfiguracionDialogoComponent } from './components/configuracion-dialogo/configuracion-dialogo.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mis Métodos';
  isDarkMode = false;
  usuario$: Observable<any>;
  isLoginPage = false;

  constructor(
    public themeService: ThemeService,
    public router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private metodosService: MetodosService,
    private jsonbinService: JsonbinService
  ) {
    this.usuario$ = this.authService.usuario$;
    
    // Detectar cambios de ruta
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    // Cargar usuario del localStorage al iniciar la app
    this.authService.cargarUsuarioDesdeLoacalStorage();
    
    // Sincronizar automáticamente al cargar si Modo Producción está activo
    this.sincronizarAlCargar();
  }

  private sincronizarAlCargar() {
    const modoDesarrollo = localStorage.getItem('modo_desarrollo') === 'true';
    const jsonbinApiKey = localStorage.getItem('jsonbin_api_key');
    const jsonbinBinId = localStorage.getItem('jsonbin_bin_id');
    
    console.log('🚀 App cargada - Verificando sincronización inicial');
    console.log('   Modo Desarrollo:', modoDesarrollo);
    console.log('   API Key existe:', !!jsonbinApiKey);
    console.log('   Bin ID existe:', !!jsonbinBinId);
    
    // Si está en Modo Producción (desactivado) y tiene credenciales, sincronizar bidireccional
    if (!modoDesarrollo && jsonbinApiKey && jsonbinBinId) {
      console.log('🔄 Sincronización bidireccional al cargar...');
      
      // Descargar datos de la nube
      this.jsonbinService.pullData().subscribe({
        next: (dataNube) => {
          const metodosLocales = this.metodosService.getTodosLosMetodos();
          
          // Merge: combinar ambos sin duplicados (por ID)
          const metodosMap = new Map();
          
          // Primero agregar los de la nube
          dataNube.metodos.forEach(m => metodosMap.set(m.id, m));
          
          // Luego agregar/actualizar con los locales (más recientes ganan)
          metodosLocales.forEach(m => {
            const existente = metodosMap.get(m.id);
            if (!existente || new Date(m.ultimaModificacion) > new Date(existente.ultimaModificacion)) {
              metodosMap.set(m.id, m);
            }
          });

          const metodosSincronizados = Array.from(metodosMap.values());

          // Guardar localmente
          localStorage.setItem('metodos', JSON.stringify(metodosSincronizados));
          
          // Actualizar el service
          metodosSincronizados.forEach(metodo => {
            this.metodosService.actualizarMetodo(metodo.id, metodo);
          });

          // Subir a la nube
          this.jsonbinService.pushData(metodosSincronizados).subscribe({
            next: () => {
              console.log('✅ Sincronización bidireccional completada al cargar');
            },
            error: (error) => {
              console.error('❌ Error al subir durante sincronización inicial:', error.message);
            }
          });
        },
        error: (error) => {
          console.error('❌ Error al descargar durante sincronización inicial:', error.message);
        }
      });
    } else if (modoDesarrollo) {
      console.log('⏭️ Modo Desarrollo activo - no sincronizar');
    } else {
      console.log('⏭️ Sin credenciales configuradas');
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirConfiguracion() {
    this.dialog.open(ConfiguracionDialogoComponent, {
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: false
    });
  }
}
