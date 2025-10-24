import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private isDarkModeSubject = new BehaviorSubject<boolean>(this.cargarTema());
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    this.aplicarTema(this.isDarkModeSubject.value);
  }

  private cargarTema(): boolean {
    const saved = localStorage.getItem(this.THEME_KEY);
    return saved ? saved === 'dark' : false;
  }

  private guardarTema(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  private aplicarTema(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newValue);
    this.guardarTema(newValue);
    this.aplicarTema(newValue);
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}

