import { UsuarioResponse } from '../../usuarios/models/usuario-response.model';

export interface DesejosResponse {
  nome: string;
  preco: number;
  usuario: UsuarioResponse;
  prioridade: number;
}
