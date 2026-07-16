import { Injectable } from '@angular/core';
import { TipoPagamentoResponse } from '../models/tipo-pagamento-response.model';

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoCacheService {
  private cache: TipoPagamentoResponse[] | null = null;

  get(): TipoPagamentoResponse[] | null {
    return this.cache;
  }

  set(tipos: TipoPagamentoResponse[]): void {
    this.cache = tipos;
  }

  clear(): void {
    this.cache = null;
  }
}
