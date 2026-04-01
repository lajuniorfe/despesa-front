import { Component } from '@angular/core';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [Toolbar, RouterLink, ToolbarModule, Button],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
