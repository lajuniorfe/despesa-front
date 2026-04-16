import { DespesaRequest } from './../models/despesa-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DespesaRelacionamentoResponse } from '../models/retorno-despesa.model';

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  caminho = 'https://localhost:7104/api/despesa';
  headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  listarDespesasMesInformado(
    mesInformado: number,
    anoInformado: number,
  ): Observable<DespesaRelacionamentoResponse[]> {
    return this.http.get<DespesaRelacionamentoResponse[]>(
      `${this.caminho}/mes/${mesInformado}/${anoInformado}`,
    );
  }

  cadastrarDespesa(request: DespesaRequest): Observable<DespesaRelacionamentoResponse> {
    return this.http.post<DespesaRelacionamentoResponse>(`${this.caminho}`, request, {
      headers: this.headers,
    });
  }

  obterDespesaPorId(id: number): Observable<DespesaRelacionamentoResponse> {
    return this.http.get<DespesaRelacionamentoResponse>(`${this.caminho}/${id}`);
  }
}
