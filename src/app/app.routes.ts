import { Routes } from '@angular/router';
import { ServicioComponent } from './components/servicio/servicio.component';


export const routes: Routes = [
  { path: 'solicitudservicio', component: ServicioComponent },

  // Ruta por defecto redirige al formulario de servicio
  { path: '', redirectTo: 'solicitudservicio', pathMatch: 'full' },

  // Redirige a solicitud de servicio para cualquier ruta no definida
  { path: '**', redirectTo: 'solicitudservicio' }
];
