import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isAuthenticated = !!localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');

    if (isAuthenticated) {
      // Validar si el usuario tiene acceso a la ruta según el tipo
      const expectedType = route.data['userType'];
      if (expectedType && userType !== expectedType) {
        // Redirigir a la página del tipo de usuario si no coincide
        return this.router.parseUrl(`/${userType}-dashboard`);
      }
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
