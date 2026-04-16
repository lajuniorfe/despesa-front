import { CommonModule, isPlatformBrowser } from '@angular/common';
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

@Component({
  selector: 'app-relatorio-despesa.component',
  imports: [CardModule, DividerModule, TreeModule, ButtonModule, ChartModule, CommonModule],
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
  graficodeque: string = '';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.listaDespesasMesAtual = JSON.parse(sessionStorage.getItem('despesas') || '[]');

    if (this.listaDespesasMesAtual) {
      this.atualizarRelatorio();
    }
  }

  atualizarRelatorio() {
    const categoriasMapGlobal = new Map<number, CategoriaResponse>();
    const tiposMap = new Map<number, TreeNode>();
    // 🔥 total geral (para calcular % dos tipos)
    const totalGeral = this.listaDespesasMesAtual.reduce((acc, l) => acc + l.despesa.valor, 0);

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
          label: `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])}`,
          children: [],
          data: { total: 0, categoriasMap: new Map<number, TreeNode>(), tipo: tipo, percentual: 0 },
          expanded: tipo === 1,
        });
      }

      const tipoNode = tiposMap.get(tipo)!;
      const categoriasMap: Map<number, TreeNode> = tipoNode.data.categoriasMap;

      if (!categoriasMap.has(categoria.id)) {
        const categoriaNode: TreeNode = {
          label: `${categoria.nome}`,
          children: [],
          data: { total: 0, percentual: 0 },
          parent: tipoNode,
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

    this.arvores.forEach((tipoNode) => {
      const totalTipo = tipoNode.data.total;

      // % do tipo em relação ao total geral
      tipoNode.data.percentual = totalGeral > 0 ? (totalTipo / totalGeral) * 100 : 0;

      // % das categorias em relação ao tipo
      tipoNode.children?.forEach((categoriaNode: any) => {
        const totalCategoria = categoriaNode.data.total;

        categoriaNode.data.percentual = totalTipo > 0 ? (totalCategoria / totalTipo) * 100 : 0;
      });
    });

    const tipoInicial = this.arvores.find((t) => t.data?.tipo === 1);

    if (tipoInicial) {
      this.iniciarGrafico({ node: tipoInicial });
    }
  }

  selecionado(event: any) {
    console.log('evento recebido', event);
    const texto = event.node.label.split('----------')[0].trim();
    const tipoSelecionado = this.encontrarTipo(event.node);
    let textoEnum = TipoCategoriaUtilService.normalizarParaEnum(texto);

    if (!(textoEnum in TipoCategoriaEnum)) return;

    setTimeout(() => {
      this.arvores?.forEach((n) => {
        n.expanded = n === tipoSelecionado;
      });

      this.arvores = [...this.arvores!];
    });

    this.iniciarGrafico(event);
    this.graficodeque = texto;
  }

  iniciarGrafico(evento?: any) {
    if (!evento) return;

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const categorias = evento.node.children || [];

      const labels = categorias.map((c: any) => c.label.split('----------')[0].trim());

      const totalTipo = evento.node.data.total;

      const valoresPercentual = categorias.map((c: any) => {
        const valor = c.data.total;
        return totalTipo > 0 ? Number(((valor / totalTipo) * 100).toFixed(2)) : 0;
      });

      const cores = [
        '--p-cyan-500',
        '--p-orange-500',
        '--p-green-500',
        '--p-purple-500',
        '--p-pink-500',
        '--p-blue-500',
        '--p-yellow-500',
        '--p-indigo-500',
        '--p-teal-500',
        '--p-red-500',
      ];

      const backgroundColor = labels.map((_: any, i: number) =>
        documentStyle.getPropertyValue(cores[i % cores.length]),
      );

      this.data = {
        labels: labels,
        datasets: [
          {
            data: valoresPercentual,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: backgroundColor,
          },
        ],
      };
      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return context.label + ': ' + context.raw + '%';
              },
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  encontrarTipo(nodeSelecionado: TreeNode): TreeNode | undefined {
    return this.arvores?.find((tipo) => this.nodePertence(tipo, nodeSelecionado));
  }

  nodePertence(pai: TreeNode, filho: TreeNode): boolean {
    if (pai === filho) return true;

    if (!pai.children) return false;

    return pai.children.some((c) => this.nodePertence(c, filho));
  }
}
