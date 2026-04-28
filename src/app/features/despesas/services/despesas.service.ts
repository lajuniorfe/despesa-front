import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AlterarDespesaRequest } from '../models/despesa-request-alterar.model';
import { DespesaRelacionamentoResponse } from '../models/retorno-despesa.model';
import { DespesaRequest } from './../models/despesa-request.model';

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  caminho = environment.serverUrl + 'despesa';
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

  alterarDespesa(request: AlterarDespesaRequest) {
    return this.http.put<DespesaRelacionamentoResponse>(`${this.caminho}`, request, {
      headers: this.headers,
    });
  }
}
