import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { TipoPlanComponent } from "./components/tipo-plan/tipo-plan.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, TipoPlanComponent],
  template: `
    <!-- Muestra los componentes según la autenticación y la ruta -->
    <ng-container *ngIf="!isLoginRoute; else loginOnly">
      <div class="app-container">
        <app-sidebar></app-sidebar>
        <div class="main-content">
          <app-header></app-header>
          <router-outlet></router-outlet>
        </div>
      </div>
    </ng-container>

    <!-- Solo el login se muestra cuando está en /login -->
    <ng-template #loginOnly>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        min-height: 100vh;
      }
      .main-content {
        flex: 1;
        background: #f5f5f5;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  isLoginRoute = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscríbete al estado de autenticación
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });

    // Verifica si la ruta actual es '/login'
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
    });
  }
}
