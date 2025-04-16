import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <h2>SOCRATES APP</h2>
      </div>
      <div class="user-info">
        <img src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4396.jpg" alt="User" class="avatar">
        <div class="user-details"> 
           <h3>Bienvenido</h3>
        </div>
      </div>
      <nav>
        <a *ngFor="let item of menuItems"
           [routerLink]="item.path"
           routerLinkActive="active">
          <i class="fas {{ item.icon }}"></i> {{ item.label }}
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #1a237e;
      color: white;
      padding: 1rem;
    }
    .logo h2 {
      margin: 0;
      padding: 1rem 0;
    }
    .user-info {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 1rem;
    }
    nav {
      margin-top: 2rem;
    }
    nav a {
      color: white;
      text-decoration: none;
      padding: 0.8rem 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      transition: background-color 0.3s;
      display: block;
      
    }
    nav a:hover, nav a.active {
      background: rgba(255,255,255,0.1);
    }
  `]
})
export class SidebarComponent {
  usuario: any = null;
  private authService = inject(AuthService);
  
  menuItems: MenuItem[] = [
    { path: '/empleado-dashboard', icon: 'fa-user-tie', label: 'Gestionar Empleados' },
    { path: '/clientes', icon: 'fa-users', label: 'Gestionar Clientes' },
    { path: '/solicitudservicio', icon: 'fa-clipboard-list', label: 'Solicitud de Servicios' },
    { path: '/tipo-plan', icon: 'fa-file-alt', label: 'Tipo Plan' }
  ];

 
  
}
