import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { InvestimentoResponse } from "../models/investimento.model";
import { InvestimentoRequest } from "../models/investimento-request.model";

@Injectable({
  providedIn: 'root',
})
export class InvestimentoService {
  private caminho = environment.serverUrl + 'investimento';

  constructor(private http: HttpClient) {}

  listarInvestimentos(): Observable<InvestimentoResponse[]> {
    return this.http.get<InvestimentoResponse[]>(`${this.caminho}`);
  }
  
  cadastrarInvestimento(request:InvestimentoRequest): Observable<InvestimentoResponse> {
    return this.http.post<InvestimentoResponse>(`${this.caminho}`, request);
  }
}