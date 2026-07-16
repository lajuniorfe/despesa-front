import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartaoResponse } from '../models/cartao-response.model';
import { CartaoCacheService } from './cartao-cache.service';

@Injectable({
  providedIn: 'root',
})
export class CartaoService {
  caminho = environment.serverUrl + 'cartao';

  constructor(
    private http: HttpClient,
    private readonly cache: CartaoCacheService,
  ) {}

  listarCartoes(): Observable<CartaoResponse[]> {
    const cache = this.cache.get();
    if (cache) {
      return of(cache);
    }
    return this.http.get<CartaoResponse[]>(`${this.caminho}`).pipe(
      tap((tipos) => {
        this.cache.set(tipos);
      }),
    );
  }
}
