import { Injectable } from '@angular/core';
import { UsuarioAutenticado } from '../../../features/usuarios/models/usuario-autenticado.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  obterUsuarioLogado(): UsuarioAutenticado {
    const token = sessionStorage.getItem('token');

    if (token) {
      const payload = this.getPayloadFromToken(token);
      const usuarioAutenticado: UsuarioAutenticado = {
        nome: payload.sub,
        id: payload.jti,
      };

      return usuarioAutenticado;
    }

    throw new Error('Nenhum usuário logado');
  }

  private getPayloadFromToken(token: string): any {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(payloadJson);
  }
}
