import { FaturaResponse } from '../../faturas/models/faturas-response.model';
import { DespesaResponse } from './despesa-response.model';

export interface DespesaRelacionamentoResponse {
  numeroParcela: number;
  totalParcela: number;
  valor: number;
  fatura: FaturaResponse;
  data: Date;
  despesa: DespesaResponse;
}
