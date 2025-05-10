import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Verificar si existe un token de autenticación (esto implica que el usuario inició sesión)
    const isAuthenticated = !!localStorage.getItem('authToken');
    // Recuperamos el tipo de usuario que se encontró en el login (debe corresponder a un cargo de empleado)
    const userType = localStorage.getItem('userType');

    if (!isAuthenticated) {
      // Si no está autenticado, lo enviamos a la página de login.
      return this.router.parseUrl('/login');
    }

    // Lista de roles válidos para empleados en el sistema (según el diagrama y la lógica del negocio)
    const allowedEmployeeRoles = ['admin', 'secretaria', 'tecnico'];
    if (!userType || !allowedEmployeeRoles.includes(userType.toLowerCase())) {
      // Si el userType no es ninguno de los permitidos, se redirige a login (o a otra ruta de acceso denegado)
      return this.router.parseUrl('/login');
    }

    // Opcional: Si en la configuración de la ruta se establece un rol esperado vía data,
    // podemos validar que el tipo de usuario corresponda.
    const expectedRole = route.data['userType'] as string;
    if (expectedRole && userType.toLowerCase() !== expectedRole.toLowerCase()) {
      // Si el rol no coincide, se lo redirige a su vista correspondiente mediante una URL dinámica.
      // Por ejemplo: "/admin-dashboard", "/secretaria-dashboard", "/tecnico-dashboard".
      return this.router.parseUrl(`/${userType.toLowerCase()}-dashboard`);
    }

    // Si se cumplen todas las condiciones, se permite la navegación
    return true;
  }
}
