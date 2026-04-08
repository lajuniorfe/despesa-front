import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticarRequest } from '../models/autenticar-request.model';
import { Observable } from 'rxjs';
import { AutenticarResponse } from '../models/autenticar-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private caminho = 'https://localhost:7104/api/auth';
  private headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  logar(request: AutenticarRequest): Observable<AutenticarResponse> {
    return this.http.post<AutenticarResponse>(`${this.caminho}/login`, request, {
      headers: this.headers,
    });
  }
}
