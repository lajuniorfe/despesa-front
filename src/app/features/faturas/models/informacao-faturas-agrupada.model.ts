import { DespesaResponse } from '../../despesas/models/despesa-response.model';
import { DespesaRelacionamentoResponse } from '../../despesas/models/retorno-despesa.model';

export interface InformacaoFaturasAgrupadas {
  nomeCartao: string;
  imagemCartao: string;
  valorFatura: number;
  vencimento: Date;
  despesas: DespesaRelacionamentoResponse[];
}
