import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // <-- Eliminamos Sidebar, Header y otros que no están
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
