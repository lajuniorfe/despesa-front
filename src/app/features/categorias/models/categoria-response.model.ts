import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';

export interface CategoriaResponse {
  id: number;
  nome: string;
  tipo: TipoCategoriaEnum;
  icone: string;
}
