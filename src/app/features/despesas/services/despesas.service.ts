import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AlterarDespesaRequest } from '../models/despesa-request-alterar.model';
import { DespesaRelacionamentoResponse } from '../models/retorno-despesa.model';
import { DespesaRequest } from './../models/despesa-request.model';
import { DespesaCacheService } from './despesas-cache.services';

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  caminho = environment.serverUrl + 'despesa';
  headers = { 'Content-Type': 'application/json' };

  constructor(
    private http: HttpClient,
    private cache: DespesaCacheService,
  ) {}

  listarDespesasMesInformado(
    mesInformado: number,
    anoInformado: number,
  ): Observable<DespesaRelacionamentoResponse[]> {
    const cache = this.cache.get(anoInformado, mesInformado);

    if (cache) {
      return of(cache);
    }

    return this.http
      .get<
        DespesaRelacionamentoResponse[]
      >(`${this.caminho}/mes/${mesInformado}/${anoInformado}`)
      .pipe(
        tap((despesas) => {
          this.cache.set(anoInformado, mesInformado, despesas);
        }),
      );
  }

  cadastrarDespesa(
    request: DespesaRequest,
  ): Observable<DespesaRelacionamentoResponse> {
    return this.http
      .post<DespesaRelacionamentoResponse>(`${this.caminho}`, request, {
        headers: this.headers,
      })
      .pipe(
        tap((despesa) => {
          this.cache.add(
            request.data.getFullYear(),
            request.data.getMonth(),
            despesa,
          );
        }),
      );
  }

  obterDespesaPorId(id: number): Observable<DespesaRelacionamentoResponse> {
    return this.http.get<DespesaRelacionamentoResponse>(
      `${this.caminho}/${id}`,
    );
  }

  alterarDespesa(request: AlterarDespesaRequest) {
    return this.http
      .put<DespesaRelacionamentoResponse>(`${this.caminho}`, request, {
        headers: this.headers,
      })
      .pipe(
        tap((despesa) => {
          const data = new Date(despesa.data);
          this.cache.update(data.getFullYear(), data.getMonth() + 1, despesa);
        }),
      );
  }

  excluirDespesa(id: number) {
    return this.http.delete(`${this.caminho}/${id}`);
  }

  listarReceitas() {
    const ID_CATEGORIA = 31;
    return this.http.get<DespesaRequest[]>(
      `${this.caminho}/categoria/${ID_CATEGORIA}`,
    );
  }
}
