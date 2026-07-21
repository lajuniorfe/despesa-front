import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AutenticarRequest } from '../models/autenticar-request.model';
import { AutenticarResponse } from '../models/autenticar-response.model';
import { UsuarioResponse } from '../../usuarios/models/usuario-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private caminho = environment.serverUrl + 'usuario';

  private headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  buscarUsuarioIdAzure(idAzure: string): Observable<UsuarioResponse> {
    return this.http.get<any>(`${this.caminho}/azure/${idAzure}`, {
      headers: this.headers,
    });
  }
}
