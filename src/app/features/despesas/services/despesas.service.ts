import { DespesaRequest } from './../models/despesa-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DespesaResponse } from '../models/despesa-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  caminho = 'https://localhost:7104/api/despesa';
  headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  listarDespesasMesInformado(mesInformado: number): Observable<DespesaResponse[]> {
    return this.http.get<DespesaResponse[]>(`${this.caminho}/mes/${mesInformado}`);
  }

  cadastrarDespesa(request: DespesaRequest) {
    return this.http.post<DespesaRequest>(`${this.caminho}`, request, {
      headers: this.headers,
    });
  }
}
