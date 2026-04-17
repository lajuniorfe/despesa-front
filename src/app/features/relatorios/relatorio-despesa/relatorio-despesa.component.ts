import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { TreeModule } from 'primeng/tree';
import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';
import { TipoCategoriaUtilService } from '../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';
import { CategoriaResponse } from '../../categorias/models/categoria-response.model';
import { DespesaRelacionamentoResponse } from '../../despesas/models/retorno-despesa.model';
import { GraficoRelatorioComponent } from '../grafico-relatorio.component/grafico-relatorio.component';
import { RelatorioCategoriaComponent } from '../relatorio-categoria.component/relatorio-categoria.component';

@Component({
  selector: 'app-relatorio-despesa.component',
  imports: [
    CardModule,
    DividerModule,
    TreeModule,
    ButtonModule,
    ChartModule,
    CommonModule,
    GraficoRelatorioComponent,
    RelatorioCategoriaComponent,
  ],
  templateUrl: './relatorio-despesa.component.html',
  styleUrl: './relatorio-despesa.component.css',
})
export class RelatorioDespesaComponent {
  mesAtual = 'Maio';
  listaDespesasMesAtual!: DespesaRelacionamentoResponse[];
  categorias: CategoriaResponse[] = [];
  arvores: TreeNode[] | null = null;
  data: any | null = null;
  options: any | null = null;
  platformId = inject(PLATFORM_ID);
  tipoGraficoExbido: string = '';
  Node: any = null;
  totalDespesas: number = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.listaDespesasMesAtual = JSON.parse(sessionStorage.getItem('despesas') || '[]');

    if (this.listaDespesasMesAtual) {
      const total = this.listaDespesasMesAtual.reduce(
        (acc, l) => acc + Math.round(l.valor * 100),
        0,
      );

      const totalFinal = total / 100;
      this.totalDespesas = totalFinal;

      this.atualizarRelatorio();
    }
  }

  atualizarRelatorio() {
    const categoriasMapGlobal = new Map<number, CategoriaResponse>();
    const tiposMap = new Map<number, TreeNode>();

    const totalGeral =
      this.listaDespesasMesAtual.reduce((acc, l) => acc + Math.round(l.valor * 100), 0) / 100;

    this.listaDespesasMesAtual.forEach((l) => {
      const categoria = l.despesa.categoria;
      const tipo = l.despesa.categoria.tipo;
      const valor = l.valor;

      // guarda categoria única no map global
      if (!categoriasMapGlobal.has(categoria.id)) {
        categoriasMapGlobal.set(categoria.id, categoria);
      }

      if (!tiposMap.has(tipo)) {
        tiposMap.set(tipo, {
          label: `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])}`,
          children: [],
          data: { total: 0, categoriasMap: new Map<number, TreeNode>(), tipo: tipo, percentual: 0 },
          expanded: tipo === 1,
        });
      }

      const tipoNode = tiposMap.get(tipo)!;
      const categoriasMap: Map<number, TreeNode> = tipoNode.data.categoriasMap;

      if (!categoriasMap.has(categoria.id)) {
        let corBotao = '';

        switch (categoria.tipo) {
          case 1:
            corBotao = 'bg-blue-500';
            break;
          case 2:
            corBotao = 'bg-green-500';
            break;
          case 3:
            corBotao = 'bg-yellow-500';
            break;
          case 4:
            corBotao = 'bg-red-500';
            break;
        }

        const categoriaNode: TreeNode = {
          label: `${categoria.nome}`,
          children: [],
          data: { total: 0, percentual: 0 },
          parent: tipoNode,
          icon: categoria.icone,
          styleClass: corBotao,
        };
        categoriasMap.set(categoria.id, categoriaNode);
        tipoNode.children!.push(categoriaNode);
      }

      const categoriaNode = categoriasMap.get(categoria.id)!;

      // adiciona a despesa dentro da categoria
      categoriaNode.children!.push({
        label: `${l.despesa.descricao}`,
        data: l.despesa,
        parent: categoriaNode,
      });

      // soma o valor no total da categoria
      categoriaNode.data.total += valor;
      categoriaNode.label = `${categoria.nome} `;

      // soma o valor no total do tipo
      tipoNode.data.total += valor;
      tipoNode.label = `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])}`;
    });

    this.categorias = Array.from(categoriasMapGlobal.values());
    this.arvores = Array.from(tiposMap.values());
    this.calcularPercentuais(this.arvores, totalGeral);

    // this.arvores.forEach((tipoNode) => {
    //   const totalTipo = tipoNode.data.total;

    //tipoNode.data.percentual = this.calcularPercentual(totalGeral, totalTipo);

    //   tipoNode.children?.forEach((categoriaNode: any) => {
    //     const totalCategoria = categoriaNode.data.total;
    //     categoriaNode.data.percentual = this.calcularPercentual(totalCategoria, totalTipo);
    //   });
    // });

    const tipoInicial = this.arvores.find((t) => t.data?.tipo === 1);

    if (tipoInicial) {
      this.tipoGraficoExbido = 'Essêncial';

      this.Node = tipoInicial;
    }
  }

  selecionado(node: any) {
    this.Node = node;
  }

  toggle(node: any) {
    this.selecionado(node);
    node.expanded = !node.expanded;
  }

  calcularPercentual(totalGeral: number, totalTipo: number): number {
    return totalGeral > 0 ? (totalTipo / totalGeral) * 100 : 0;
  }

  calcularPercentuais(arvores: TreeNode<any>[] | null, totalGeral: number) {
    arvores?.forEach((tipoNode) => {
      const totalTipo = tipoNode.data.total;

      tipoNode.data.percentual = this.calcularPercentual(totalGeral, totalTipo);

      tipoNode.children?.forEach((categoriaNode: any) => {
        const totalCategoria = categoriaNode.data.total;
        categoriaNode.data.percentual = this.calcularPercentual(totalTipo, totalCategoria);
      });
    });
  }
}
