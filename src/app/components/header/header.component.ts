import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateService } from '../../services/date.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="search-bar">
        <input type="text" placeholder="Busca por categoría...">
        <button><i class="fas fa-search"></i></button>
      </div>
      <div class="header-right">
        <div class="language">
          <span>Español (ES)</span>
        </div>
        <div class="datetime">
          <span>{{ currentDate | date:'d MMMM yyyy' }}</span>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .search-bar input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .datetime {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentDate = this.dateService.getCurrentDate();
  currentTime = '';
  private timeSubscription?: Subscription;

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.timeSubscription = this.dateService.getCurrentTime()
      .subscribe(time => this.currentTime = time);
  }

  ngOnDestroy() {
    this.timeSubscription?.unsubscribe();
  }
}