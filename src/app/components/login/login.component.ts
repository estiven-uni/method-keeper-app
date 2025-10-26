import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  mostrarPassword = false;
  cargando = false;
  isDarkMode = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.snackBar.open('⚠️ Ingresa usuario y contraseña', 'Cerrar', { duration: 3000 });
      return;
    }

    this.cargando = true;
    
    // Simular delay de login
    setTimeout(() => {
      const exitoso = this.authService.login(this.username, this.password);
      this.cargando = false;

      if (exitoso) {
        this.snackBar.open('✅ Bienvenido!', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/']);
      } else {
        this.snackBar.open('❌ Credenciales inválidas', 'Cerrar', { duration: 3000 });
      }
    }, 500);
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  presionarEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
