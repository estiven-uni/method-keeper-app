import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from './services/theme.service';
import { ConfiguracionDialogoComponent } from './components/configuracion-dialogo/configuracion-dialogo.component';

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
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mis Métodos';
  isDarkMode = false;

  constructor(
    public themeService: ThemeService,
    public router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  abrirConfiguracion() {
    this.dialog.open(ConfiguracionDialogoComponent, {
      width: '500px',
      maxWidth: '90vw'
    });
  }
}
