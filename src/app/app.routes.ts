import { Routes } from '@angular/router';
import { ServicioComponent } from './components/servicio/servicio.component';
import { LoginComponent } from './components/login/login.component';
import { TipoPlanComponent } from './components/tipo-plan/tipo-plan.component';


export const routes: Routes = [
  { path: 'solicitudservicio', component: ServicioComponent },
  { path: 'tipo-plan', component: TipoPlanComponent },


  // Ruta por defecto redirige al formulario de servicio
  //{ path: '', redirectTo: 'solicitudservicio', pathMatch: 'full' },

  // Redirige a solicitud de servicio para cualquier ruta no definida
  //{ path: '**', redirectTo: 'solicitudservicio' },
  { path: 'login', component: LoginComponent },
    
  //{path: 'servicio', component:ServicioComponent},
  
  // Ruta por defecto redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Redirige a login para cualquier ruta no definida
  { path: '**', redirectTo: 'login' }

];
