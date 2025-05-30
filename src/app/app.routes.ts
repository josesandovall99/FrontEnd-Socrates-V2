import { Routes } from '@angular/router';
import { ServicioComponent } from './components/servicio/servicio.component';
import { LoginComponent } from './components/login/login.component';
import { TipoPlanComponent } from './components/tipo-plan/tipo-plan.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { SecretariaDashboardComponent } from './components/secretaria/secretaria.component';
import { ProductoComponent } from './components/Producto/producto.component';
import { AuthGuard } from './auth.guard';
import { AdministradorDashboardComponent } from './components/administrador/administrador.dashboard';
import { SoporteComponent } from './components/soporte/soporte.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';


export const routes: Routes = [
  { path: 'solicitudservicio/:clienteId', component: ServicioComponent },
  { path: 'tipo-plan', component: TipoPlanComponent },
  { path: 'clientes', component: ClienteComponent},
  { path: 'empleados', component: EmpleadoComponent},
  { path: 'contratos/:clienteId/:servicioId', component: ContratoComponent},
   { path: 'productos', component: ProductoComponent},
  { 
    path: 'secretaria-dashboard', 
    component: SecretariaDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { userType: 'secretaria' } 
  },

  { 
    path: 'administrador-dashboard', 
    component: AdministradorDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { userType: 'admin' } 
  },
  { 
    path: 'soportes', 
    component: SoporteComponent, 
    canActivate: [AuthGuard], 
    data: { userType: 'secretaria' } 
  },
  { 
    path: 'mantenimientos', 
    component: MantenimientoComponent, 
    canActivate: [AuthGuard], 
    data: { userType: 'secretaria' } 
  },


  // Ruta por defecto redirige al formulario de servicio
  //{ path: '', redirectTo: 'solicitudservicio', pathMatch: 'full' },

  // Redirige a solicitud de servicio para cualquier ruta no definida
  //{ path: '**', redirectTo: 'solicitudservicio' },
  { path: 'login', component: LoginComponent },
    
  {
    path: 'empleados/editar/:id',
    component: EmpleadoComponent
  },
  {
    path: 'clientes/editar/:id',
    component: ClienteComponent
  },
  //{path: 'servicio', component:ServicioComponent},
  
  // Ruta por defecto redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Redirige a login para cualquier ruta no definida
  { path: '**', redirectTo: 'login' }

];
