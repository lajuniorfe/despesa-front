export interface AlterarDespesaRequest {
  idDespesa: number;
  valorDespesa: number;
  dataDespesa: Date;
  descricao: string;
  parcela: number;
  idCartao: number;
}
