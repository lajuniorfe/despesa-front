import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AutenticarRequest } from '../../models/autenticar-request.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formulario!: FormGroup;

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

        this.router.navigate(['']);
      },
      error: (error) => {},
    });
  }
}
