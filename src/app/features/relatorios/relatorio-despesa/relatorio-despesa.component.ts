import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DespesaRelacionamentoResponse } from '../../despesas/models/retorno-despesa.model';
import { EstadoService } from '../../../shared/services/utils/estado/estado.service';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';
import { TipoCategoriaUtilService } from '../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';
import { ChartModule } from 'primeng/chart';
import { CategoriaResponse } from '../../categorias/models/categoria-response.model';

@Component({
  selector: 'app-relatorio-despesa.component',
  imports: [CardModule, DividerModule, TreeModule, ButtonModule, ChartModule],
  templateUrl: './relatorio-despesa.component.html',
  styleUrl: './relatorio-despesa.component.css',
})
export class RelatorioDespesaComponent {
  mesAtual = 'Maio';
  listaDespesasMesAtual!: DespesaRelacionamentoResponse[];
  categorias: CategoriaResponse[] = [];
  arvores: TreeNode[] = [];
  data: any;
  options: any;

  constructor(private estadoService: EstadoService) {}

  ngOnInit() {
    this.listaDespesasMesAtual = this.estadoService.getInfo();
    console.log('Info recebida da Home:', this.listaDespesasMesAtual);

    if (this.listaDespesasMesAtual) {
      const categoriasMapGlobal = new Map<number, CategoriaResponse>();
      const tiposMap = new Map<number, TreeNode>();
      const formatadorBRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      this.listaDespesasMesAtual.forEach((l) => {
        const categoria = l.despesa.categoria;
        const tipo = l.despesa.categoria.tipo;
        const valor = l.despesa.valor;

        // guarda categoria única no map global
        if (!categoriasMapGlobal.has(categoria.id)) {
          categoriasMapGlobal.set(categoria.id, categoria);
        }

        if (!tiposMap.has(tipo)) {
          tiposMap.set(tipo, {
            label: `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])} ---------- 0`,
            children: [],
            data: { total: 0, categoriasMap: new Map<number, TreeNode>() },
          });
        }

        const tipoNode = tiposMap.get(tipo)!;
        const categoriasMap: Map<number, TreeNode> = tipoNode.data.categoriasMap;

        if (!categoriasMap.has(categoria.id)) {
          const categoriaNode: TreeNode = {
            label: `${categoria.nome} ---------- ${formatadorBRL.format(0)}`,
            children: [],
            data: { total: 0 },
          };
          categoriasMap.set(categoria.id, categoriaNode);
          tipoNode.children!.push(categoriaNode);
        }

        const categoriaNode = categoriasMap.get(categoria.id)!;

        // adiciona a despesa dentro da categoria
        categoriaNode.children!.push({
          label: `${l.despesa.descricao} (${formatadorBRL.format(valor)})`,
          data: l.despesa,
        });

        // soma o valor no total da categoria
        categoriaNode.data.total += valor;
        categoriaNode.label = `${categoria.nome} ---------- ${formatadorBRL.format(categoriaNode.data.total)}`;

        // soma o valor no total do tipo
        tipoNode.data.total += valor;
        tipoNode.label = `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])} ---------- ${formatadorBRL.format(tipoNode.data.total)}`;
      });

      this.categorias = Array.from(categoriasMapGlobal.values());
      this.arvores = Array.from(tiposMap.values());
    }
  }

  iniciarGrafico() {
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          // data: [540, 325, 702],
          // backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
          // hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
        },
      ],
    };
  }
}
