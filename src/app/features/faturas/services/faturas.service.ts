import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FaturaResponse } from '../models/faturas-response.model';

@Injectable({
  providedIn: 'root',
})
export class FaturasService {
  private caminho = environment.serverUrl + 'categorfaturaia';

  constructor(private http: HttpClient) {}

  listarFaturasMesInformado(mesInformado: number): Observable<FaturaResponse[]> {
    return this.http.get<FaturaResponse[]>(`${this.caminho}/${mesInformado}`);
  }
}
