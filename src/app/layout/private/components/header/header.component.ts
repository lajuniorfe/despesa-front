import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  imports: [Toolbar, RouterLink, ToolbarModule, Button, SpeedDialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  items!: MenuItem[];

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-sign-out',
        command: () => {
          this.deslogar();
        },
      },
    ];
  }

  deslogar() {
    sessionStorage.removeItem('despesas');
    sessionStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}
