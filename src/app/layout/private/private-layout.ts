import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.css',
})
export class PrivateLayoutComponent {}
