import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartaoResponse } from '../models/cartao-response.model';

@Injectable({
  providedIn: 'root',
})
export class CartaoService {
  caminho = environment.serverUrl + 'cartao';

  constructor(private http: HttpClient) {}

  listarCartoes(): Observable<CartaoResponse[]> {
    return this.http.get<CartaoResponse[]>(`${this.caminho}`);
  }
}
