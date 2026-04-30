import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DesejosResponse } from '../models/desejos-response.model';

@Injectable({
  providedIn: 'root',
})
export class DesejosService {
  caminho = environment.serverUrl + 'despesa';
  headers = { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) {}

  buscarListaDesejos() {
    return this.http.get<DesejosResponse[]>(`${this.caminho}`);
  }
}
