import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TipoPagamentoResponse } from '../models/tipo-pagamento-response.model';
import { TipoPagamentoCacheService } from './tipo-pagamento-cache.service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoService {
  private caminho = environment.serverUrl + 'tipopagamento';

  constructor(
    private http: HttpClient,
    private cache: TipoPagamentoCacheService,
  ) {}

  listarTiposPagamento() {
    const cache = this.cache.get();
    if (cache) {
      return of(cache);
    }

    return this.http.get<TipoPagamentoResponse[]>(`${this.caminho}`).pipe(
      tap((tipos) => {
        this.cache.set(tipos);
      }),
    );
  }
}
