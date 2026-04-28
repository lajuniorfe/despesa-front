import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TipoPagamentoResponse } from '../models/tipo-pagamento-response.model';

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoService {
  private caminho = environment.serverUrl + 'tipopagamento';

  constructor(private http: HttpClient) {}

  listarTiposPagamento() {
    return this.http.get<TipoPagamentoResponse[]>(`${this.caminho}`);
  }
}
