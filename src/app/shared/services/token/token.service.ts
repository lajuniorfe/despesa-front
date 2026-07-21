import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../../../features/usuarios/models/usuario-response.model';
import { AuthService } from '../../../features/login/services/auth.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    private readonly authService: AuthService,
    private msalService: MsalService,
  ) {}

  obterUsuarioLogado(): UsuarioResponse {
    const usuario = JSON.parse(
      sessionStorage.getItem('user')!,
    ) as UsuarioResponse;

    if (!usuario) {
      this.incluirUsuarioSessao();
    }

    return usuario;
  }

  incluirUsuarioSessao() {
    let account = this.msalService.instance.getActiveAccount();
    if (account) {
      this.authService
        .buscarUsuarioIdAzure(account.localAccountId)
        .subscribe((usuario) => {
          const usuarioAutenticado: UsuarioResponse = {
            nome: usuario.nome ?? account.username,
            id: usuario.id,
          };
          sessionStorage.setItem('user', JSON.stringify(usuarioAutenticado));
        });
    }
  }
}
