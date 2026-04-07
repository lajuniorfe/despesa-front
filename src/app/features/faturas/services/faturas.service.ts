import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FaturaResponse } from '../models/faturas-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaturasService {
  caminho = 'https://localhost:7104/api/fatura';
  constructor(private http: HttpClient) {}

  listarFaturasMesInformado(mesInformado: number): Observable<FaturaResponse[]> {
    return this.http.get<FaturaResponse[]>(`${this.caminho}/${mesInformado}`);
  }
}
