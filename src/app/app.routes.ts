import { Routes } from '@angular/router';
import { ListaMetodosComponent } from './components/lista-metodos/lista-metodos.component';
import { FormularioMetodoComponent } from './components/formulario-metodo/formulario-metodo.component';
import { DetalleMetodoComponent } from './components/detalle-metodo/detalle-metodo.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ListaMetodosComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'nuevo', component: FormularioMetodoComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: FormularioMetodoComponent, canActivate: [AuthGuard] },
  { path: 'ver/:id', component: DetalleMetodoComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
