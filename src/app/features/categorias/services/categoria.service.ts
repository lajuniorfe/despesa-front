import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaResponse } from '../models/categoria-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private caminho = 'https://localhost:7104/api/categoria';

  constructor(private http: HttpClient) {}

  listarCategorias() {
    return this.http.get<CategoriaResponse[]>(`${this.caminho}`);
  }
}
