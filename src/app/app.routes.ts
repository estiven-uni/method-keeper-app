import { Routes } from '@angular/router';
import { ListaMetodosComponent } from './components/lista-metodos/lista-metodos.component';
import { FormularioMetodoComponent } from './components/formulario-metodo/formulario-metodo.component';
import { DetalleMetodoComponent } from './components/detalle-metodo/detalle-metodo.component';

export const routes: Routes = [
  { path: '', component: ListaMetodosComponent, pathMatch: 'full' },
  { path: 'nuevo', component: FormularioMetodoComponent },
  { path: 'editar/:id', component: FormularioMetodoComponent },
  { path: 'ver/:id', component: DetalleMetodoComponent },
  { path: '**', redirectTo: '' }
];
