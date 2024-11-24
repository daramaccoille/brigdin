import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>Brigdin Woods Childminding</h1>
        <nav>
          <a routerLink="/parents">Parents</a>
          <a routerLink="/children">Children</a>
          <a routerLink="/sessions">Sessions</a>
          <a routerLink="/billing">Billing</a>
        </nav>
      </header>
      <main class="container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .header {
      background-color: var(--primary);
      padding: 1rem;
      text-align: center;
    }
    
    nav {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 10px;
    }
    
    nav a {
      color: var(--text);
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
    }
    
    nav a:hover {
      background-color: var(--secondary);
      color: white;
    }
  `]
})
export class AppComponent {
  title = 'Brigdin Woods Childminding';
}