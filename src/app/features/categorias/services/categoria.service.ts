import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CategoriaRequest } from '../models/categoria-request.model';
import { CategoriaResponse } from '../models/categoria-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private caminho = environment.serverUrl + 'categoria';

  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) {}

  listarCategorias() {
    return this.http.get<CategoriaResponse[]>(`${this.caminho}`);
  }

  editarCategoria(id: number, request: CategoriaRequest) {
    return this.http.put<CategoriaResponse>(`${this.caminho}/${id}`, request, {
      headers: this.headers,
    });
  }
}
