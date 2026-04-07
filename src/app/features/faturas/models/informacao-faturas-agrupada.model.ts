import { DespesaResponse } from '../../despesas/models/despesa-response.model';

export interface InformacaoFaturasAgrupadas {
  nomeCartao: string;
  imagemCartao: string;
  valorFatura: number;
  vencimento: Date;
  despesas: DespesaResponse[];
}
