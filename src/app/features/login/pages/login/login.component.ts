import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AutenticarRequest } from '../../models/autenticar-request.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ReactiveFormsModule, ButtonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  formulario!: FormGroup;
  carregando: boolean = false;
  private messageService = inject(MessageService);

  constructor(
    private readonly authService: AuthService,
    private fb: FormBuilder,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  logar() {
    this.carregando = true;
    if (this.formulario.invalid) return;

    const loginUsuario = this.formulario.value.login;
    const senhaUsuario = this.formulario.value.senha;

    const request: AutenticarRequest = {
      login: loginUsuario,
      senha: senhaUsuario,
    };

    this.authService.logar(request).subscribe({
      next: (retorno) => {
        sessionStorage.setItem('token', retorno.token);
        this.carregando = false;
        this.router.navigate(['']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao logar',
        });
      },
    });
  }
}
