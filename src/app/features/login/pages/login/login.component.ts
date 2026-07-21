import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MsalService } from '@azure/msal-angular';
import { loginRequest } from '../../../../auth-config';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  carregando = false;

  constructor(private authService: MsalService) {}

  ngOnInit(): void {}

  logar(): void {
    console.log('ENV FRONT:', environment.uriFront);
    this.authService.loginRedirect({
      ...loginRequest,
      redirectStartPage: environment.uriFront,
    });
  }
}
