export interface DespesaRequest {
  descricao: string;
  data: Date;
  valor: number;
  idCategoria: number;
  idRecorrencia: number;
  idTipoPagamento: number;
  idCartao: number;
  parcela: number;
  idUsuario: number;
}
