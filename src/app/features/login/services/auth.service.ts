import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AutenticarRequest } from '../models/autenticar-request.model';
import { AutenticarResponse } from '../models/autenticar-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private caminho = environment.serverUrl + 'auth';

  private headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  logar(request: AutenticarRequest): Observable<AutenticarResponse> {
    return this.http.post<AutenticarResponse>(`${this.caminho}/login`, request, {
      headers: this.headers,
    });
  }
}
