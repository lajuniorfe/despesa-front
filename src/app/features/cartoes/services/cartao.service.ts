import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartaoResponse } from '../models/cartao-response.model';

@Injectable({
  providedIn: 'root',
})
export class CartaoService {
  caminho = 'https://localhost:7104/api/cartao';

  constructor(private http: HttpClient) {}

  listarCartoes(): Observable<CartaoResponse[]> {
    return this.http.get<CartaoResponse[]>(`${this.caminho}`);
  }
}
