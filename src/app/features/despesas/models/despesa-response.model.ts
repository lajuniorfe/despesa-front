import { CategoriaResponse } from '../../categorias/models/categoria-response.model';
import { FaturaResponse } from '../../faturas/models/faturas-response.model';
import { RecorrenciaResponse } from '../../tipo-despesas/models/recorrencia-response.model';
import { UsuarioResponse } from '../../usuarios/models/usuario-response.model';

export interface DespesaResponse {
  id: number;
  descricao: string;
  data: Date;
  valor: number;
  statusPagamento: false;
  categoria: CategoriaResponse;
  recorrencia: RecorrenciaResponse;
  fatura: FaturaResponse;
  usuario: UsuarioResponse;
}
