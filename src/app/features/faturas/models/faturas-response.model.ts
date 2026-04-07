import { CartaoResponse } from '../../cartoes/models/cartao-response.model';

export interface FaturaResponse {
  id: number;
  vencimento: number;
  cartao: CartaoResponse;
}
