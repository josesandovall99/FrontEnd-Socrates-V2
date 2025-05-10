import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

interface StatCard {
  icon: string;
  count: number;
  label: string;
  route: string; 
}

@Component({
  selector: 'app-administrador-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>ADMINISTRADOR</h1>
      <p>Bienvenido <strong>{{ firstName }} {{ lastName }}</strong>, por favor selecciona una opción:</p>
      
      <div class="stats-grid">
        <div *ngFor="let stat of stats" class="stat-card" (click)="navigate(stat)">
          <i class="fas {{ stat.icon }}"></i>
          <div class="stat-info">
            <h3>{{ stat.count }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .stat-card:hover {
      background-color: #f0f0f0;
    }
    .stat-card i {
      font-size: 2rem;
      color: #1a237e;
    }
    .stat-info h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1a237e;
    }
    .stat-info p {
      margin: 0.5rem 0 0;
      color: #666;
    }
  `]
})
export class AdministradorDashboardComponent implements OnInit {
  // Variables que almacenan el primer nombre y apellido de la secretaria
  firstName: string = '';
  lastName: string = '';

  stats: StatCard[] = [
    { icon: 'fa-users', count: 0, label: 'Gestionar Clientes', route: '/clientes' },
    { icon: 'fa-clipboard-list', count: 0, label: 'Gestionar tipos de planes', route: '/tipo-plan' },
    { icon: 'fa-user-tie', count: 0, label: 'Gestionar empleados', route: '/empleados' }
  ];
  
  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Recupera el objeto almacenado en localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.firstName = user.primerNombre;
      this.lastName = user.primerApellido;
    }

      // Obtener la cantidad 
      this.dashboardService.getTiposPlanesCount().subscribe(count => {
          const TiposPlanesCard = this.stats.find(stat => stat.label === 'Gestionar tipos de planes');
          if (TiposPlanesCard) {
              TiposPlanesCard.count = count;
          }
      });

      this.dashboardService.getClientesCount().subscribe(count => {
          const ClientesCard = this.stats.find(stat => stat.label === 'Gestionar Clientes');
          if (ClientesCard) {
              ClientesCard.count = count;
          }
      });

        this.dashboardService.getEmpleadosCount().subscribe(count => {
            const EmpleadosCard = this.stats.find(stat => stat.label === 'Gestionar empleados');
            if (EmpleadosCard) {
                EmpleadosCard.count = count;
            }
        });
  }

  navigate(stat: StatCard): void {
    this.router.navigate([stat.route]);
  }
}
