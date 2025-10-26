import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.cargarUsuario());
  public usuario$: Observable<Usuario | null> = this.usuarioSubject.asObservable();
  
  private readonly STORAGE_KEY = 'usuario_actual';

  constructor() {}

  login(username: string, password: string): boolean {
    // Credenciales hardcodeadas: admin/admin
    if (username === 'admin' && password === 'admin') {
      const usuario: Usuario = {
        username: 'admin'
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);
      console.log('✅ Login exitoso');
      return true;
    }
    
    console.log('❌ Credenciales inválidas');
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
    console.log('✅ Logout exitoso');
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  isAutenticado(): boolean {
    return this.usuarioSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.isAutenticado();
  }

  cargarUsuarioDesdeLoacalStorage(): void {
    const usuario = this.cargarUsuario();
    if (usuario) {
      this.usuarioSubject.next(usuario);
      console.log('✅ Usuario cargado desde localStorage');
    }
  }

  private cargarUsuario(): Usuario | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      return null;
    }
  }
}
