import { UsuarioResponse } from '../../usuarios/models/usuario-response.model';

export interface InvestimentoResponse {
  id: number;
  descricao: string;
  valor: number;
  tipo: number;
  data: Date;
  usuario: UsuarioResponse;
}
