import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPagamentoResponse } from '../models/tipo-pagamento-response.model';

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoService {
  caminho = 'https://localhost:7104/api/tipopagamento';

  constructor(private http: HttpClient) {}

  listarTiposPagamento() {
    return this.http.get<TipoPagamentoResponse[]>(`${this.caminho}`);
  }
}
