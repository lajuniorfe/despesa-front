import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, HeaderComponent, LoadingComponent, CommonModule],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.css',
})
export class PrivateLayoutComponent {}
