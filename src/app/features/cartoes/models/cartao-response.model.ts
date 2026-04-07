export interface CartaoResponse {
  id: number;
  nome: string;
  limite: number;
  vencimento: Date;
  fechamento: number;
  imagem: string;
}
