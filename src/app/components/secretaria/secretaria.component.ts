// secretaria-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface StatCard {
  icon: string;
  count: number;
  label: string;
  route: string; 
}

@Component({
  selector: 'app-secretaria-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>SECRETARIA</h1>
      <p>Bienvenida, {{ firstName }} {{ lastName }}.</p>
      
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
export class SecretariaDashboardComponent implements OnInit {
  // Variables que almacenan el primer nombre y apellido de la secretaria
  firstName: string = '';
  lastName: string = '';

  stats: StatCard[] = [
    { icon: 'fa-user-plus', count: 25, label: 'Gestionar Clientes', route: '/clientes' },
    { icon: 'fa-file-alt', count: 10, label: 'Gestionar Tipos de Planes', route: '/tipo-plan' },
    { icon: 'fa-phone', count: 5, label: 'Llamadas Pendientes', route: '/llamadas-pendientes' },
    { icon: 'fa-calendar-check', count: 8, label: 'Programar Citas', route: '/programar-citas' }
  ];
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Recupera el objeto almacenado en localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.firstName = user.primerNombre;
      this.lastName = user.primerApellido;
    }
  }

  navigate(stat: StatCard): void {
    this.router.navigate([stat.route]);
  }
}
