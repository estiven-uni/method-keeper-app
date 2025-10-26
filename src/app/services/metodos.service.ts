import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Metodo } from '../models/metodo.interface';
import { JsonbinService } from './jsonbin.service';

@Injectable({
  providedIn: 'root'
})
export class MetodosService {
  private readonly STORAGE_KEY = 'metodos';
  private metodosSubject = new BehaviorSubject<Metodo[]>(this.cargarMetodos());
  public metodos$: Observable<Metodo[]> = this.metodosSubject.asObservable();
  private jsonbinService?: JsonbinService;

  constructor(private injector: Injector) {}

  private cargarMetodos(): Metodo[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const metodos: Metodo[] = data ? JSON.parse(data) : [];
      // Migración: agregar campo 'activo' a métodos existentes que no lo tengan
      return metodos.map(metodo => ({
        ...metodo,
        activo: metodo.activo !== undefined ? metodo.activo : true
      }));
    } catch (error) {
      console.error('Error al cargar métodos:', error);
      return [];
    }
  }

  private guardarMetodos(metodos: Metodo[]): void {
    console.log('💾 guardarMetodos() - Guardando', metodos.length, 'métodos');
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metodos));
      console.log('   ✓ Guardado en localStorage');
      this.metodosSubject.next(metodos);
      console.log('   ✓ Actualizado metodosSubject');
      console.log('   → Llamando sincronizarAutomaticamente()...');
      this.sincronizarAutomaticamente();
      console.log('   ✓ sincronizarAutomaticamente() ejecutado');
    } catch (error) {
      console.error('❌ Error al guardar métodos:', error);
    }
  }

  private sincronizarAutomaticamente(): void {
    // Verificar si está en modo producción (modo_desarrollo = false o no existe)
    const modoDesarrolloStr = localStorage.getItem('modo_desarrollo');
    const modoDesarrollo = modoDesarrolloStr === 'true';
    const jsonbinApiKey = localStorage.getItem('jsonbin_api_key');
    
    console.log('   🔍 sincronizarAutomaticamente - Verificando condiciones:');
    console.log('      modo_desarrollo:', modoDesarrolloStr, '→ boolean:', modoDesarrollo);
    console.log('      jsonbinApiKey existe:', !!jsonbinApiKey);
    console.log('      Condición (!modoDesarrollo && jsonbinApiKey):', !modoDesarrollo && !!jsonbinApiKey);
    
    // Solo sincronizar si NO está en modo desarrollo y tiene API Key configurada
    if (!modoDesarrollo && jsonbinApiKey) {
      console.log('   ✅ SINCRONIZANDO...');
      // Lazy loading del servicio para evitar dependencia circular
      if (!this.jsonbinService) {
        this.jsonbinService = this.injector.get(JsonbinService);
      }

      const metodos = this.getTodosLosMetodos();
      this.jsonbinService.pushData(metodos).subscribe({
        next: (response) => {
          console.log('   ✅ Sincronización exitosa');
          // Si se generó un nuevo bin ID, guardarlo
          if (response.binId && !localStorage.getItem('jsonbin_bin_id')) {
            localStorage.setItem('jsonbin_bin_id', response.binId);
          }
        },
        error: (error) => {
          console.error('   ❌ Error en sincronización:', error.message);
        }
      });
    } else {
      console.log('   ⏭️ NO sincronizar:', modoDesarrollo ? 'MODO DESARROLLO' : 'SIN API KEY');
    }
  }

  getMetodos(): Metodo[] {
    return this.metodosSubject.value;
  }

  getTodosLosMetodos(): Metodo[] {
    return this.metodosSubject.value;
  }

  getMetodoById(id: string): Metodo | undefined {
    return this.metodosSubject.value.find(m => m.id === id);
  }

  getUltimoMetodoId(): string | null {
    const metodos = this.getMetodos();
    if (metodos.length === 0) return null;
    
    // Ordenar por fecha de creación y obtener el más reciente
    const ordenados = [...metodos].sort((a, b) => {
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
    
    return ordenados[0].id;
  }

  crearMetodo(metodo: Omit<Metodo, 'id' | 'fechaCreacion' | 'ultimaModificacion'>): Metodo {
    console.log('📝 crearMetodo()');
    const nuevoMetodo: Metodo = {
      ...metodo,
      id: this.generarId(),
      fechaCreacion: new Date().toISOString(),
      ultimaModificacion: new Date().toISOString(),
      activo: metodo.activo !== undefined ? metodo.activo : true
    };

    const metodos = [...this.getMetodos(), nuevoMetodo];
    this.guardarMetodos(metodos);
    return nuevoMetodo;
  }

  actualizarMetodo(id: string, cambios: Partial<Metodo>): boolean {
    console.log('✏️ actualizarMetodo() - id:', id);
    const metodos = this.getMetodos();
    const index = metodos.findIndex(m => m.id === id);
    
    if (index === -1) {
      console.error('❌ Método no encontrado para actualizar, id:', id);
      return false;
    }

    console.log('   Cambios recibidos:', Object.keys(cambios));
    metodos[index] = {
      ...metodos[index],
      ...cambios,
      id: metodos[index].id,
      fechaCreacion: metodos[index].fechaCreacion,
      ultimaModificacion: new Date().toISOString()
    };

    console.log('   Llamando guardarMetodos()');
    this.guardarMetodos(metodos);
    return true;
  }

  eliminarMetodo(id: string): boolean {
    console.log('🗑️ eliminarMetodo() - id:', id);
    const metodos = this.getMetodos();
    const filtrados = metodos.filter(m => m.id !== id);
    
    if (filtrados.length === metodos.length) {
      console.error('❌ Método no encontrado para eliminar, id:', id);
      return false;
    }

    console.log('   Llamando guardarMetodos()');
    this.guardarMetodos(filtrados);
    return true;
  }

  buscarMetodos(termino: string): Metodo[] {
    const terminoLower = termino.toLowerCase();
    return this.getMetodos().filter(m => {
      // Buscar en campos de texto
      const coincideTexto = m.titulo.toLowerCase().includes(terminoLower) ||
        m.descripcion.toLowerCase().includes(terminoLower) ||
        m.etiquetas.some(e => e.toLowerCase().includes(terminoLower));
      
      // Buscar por estado
      const coincideEstado = 
        (terminoLower.includes('activo') && m.activo === true) ||
        (terminoLower.includes('inactivo') && m.activo === false);
      
      return coincideTexto || coincideEstado;
    });
  }

  ordenarPorFecha(orden: 'asc' | 'desc' = 'desc'): Metodo[] {
    const metodos = [...this.getMetodos()];
    return metodos.sort((a, b) => {
      const fechaA = new Date(a.ultimaModificacion).getTime();
      const fechaB = new Date(b.ultimaModificacion).getTime();
      return orden === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    });
  }

  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

