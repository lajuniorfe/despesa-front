import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { SpeedDialModule } from 'primeng/speeddial';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  imports: [
    Toolbar,
    RouterLink,
    ToolbarModule,
    Button,
    SpeedDialModule,
    RouterModule,
    DrawerModule,
    Divider,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  items!: MenuItem[];
  menuAberto: boolean = false;

  constructor(private readonly router: Router) {
    this.router.events.subscribe(() => {
      this.menuAberto = false;
    });
  }

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-sign-out',
        command: () => {
          this.deslogar();
        },
      },
    ];

    const saved = localStorage.getItem('theme');
    this.isDark = saved === 'dark';

    this.applyTheme();
  }

  deslogar() {
    sessionStorage.removeItem('despesas');
    sessionStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  isDark = false;

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    const html = document.documentElement;

    if (this.isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
