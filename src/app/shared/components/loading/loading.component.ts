import { CommonModule } from '@angular/common';
import { LoadingService } from './../../services/loading/loading.service';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  imports: [ProgressSpinnerModule, CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  loading$!: Observable<boolean>;
  constructor(public loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
