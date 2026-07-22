import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  PLATFORM_ID,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { Tabs, TabsModule } from 'primeng/tabs';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeModule } from 'primeng/tree';
import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';
import { TokenService } from '../../../shared/services/token/token.service';
import { TipoCategoriaUtilService } from '../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';
import { CategoriaResponse } from '../../categorias/models/categoria-response.model';
import { DespesaRelacionamentoResponse } from '../../despesas/models/retorno-despesa.model';
import { RelatorioInvestimentoComponent } from '../components/relatorio-investimento/relatorio-investimento.component';
import { GraficoRelatorioComponent } from '../grafico-relatorio.component/grafico-relatorio.component';
import { RelatorioCategoriaComponent } from '../relatorio-categoria.component/relatorio-categoria.component';
import { DespesasService } from '../../despesas/services/despesas.service';
import { DespesaRequest } from '../../despesas/models/despesa-request.model';
import { LoadingService } from '../../../shared/services/loading/loading.service';

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
    FormsModule,
    ToggleButtonModule,
    Tabs,
    TabsModule,
    ProgressBarModule,
    RelatorioInvestimentoComponent,
  ],
  templateUrl: './relatorio-despesa.component.html',
  styleUrl: './relatorio-despesa.component.css',
})
export class RelatorioDespesaComponent {
  @Input() mesAtual!: string;
  listaDespesasMesAtual: DespesaRelacionamentoResponse[] = [];
  listaDespesasOriginal: DespesaRelacionamentoResponse[] = [];
  categorias: CategoriaResponse[] = [];
  arvores: TreeNode[] | null = null;
  data: any | null = null;
  options: any | null = null;
  platformId = inject(PLATFORM_ID);
  tipoGraficoExbido: string = '';
  Node: any = null;
  totalDespesas: number = 0;
  coresCategorias: string = '';
  checarDespesaUsuario: boolean = false;
  receita = 0;
  limiteEssencial = 0;
  limiteNaoEssencial = 0;
  limiteInvestimento = 0;
  gastoTotalEssencial = 0;
  gastoTotalNaoEssencial = 0;
  gastoTotalInvestimento = 0;
  totalGastoEmergencial = 0;
  total = 0;
  dataAtual = new Date();
  mesDespesas = this.dataAtual
    .toLocaleDateString('pt-BR', { month: 'long' })
    .replace(/^./, (letra) => letra.toUpperCase());

  constructor(
    private readonly tokenService: TokenService,
    private readonly despesasService: DespesasService,
    private readonly cd: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.buscarReceita();
    this.buscarDespesasMesInformado();
  }

  buscarDespesasMesInformado() {
    this.loadingService.show();
    this.despesasService
      .listarDespesasMesInformado(this.dataAtual.getMonth(), 2026)
      .subscribe((retorno) => {
        Promise.resolve().then(() => {
          this.listaDespesasOriginal = retorno;

          this.listaDespesasMesAtual = [
            ...this.listaDespesasOriginal.filter(
              (x) => x.despesa.categoria.tipo !== 5,
            ),
          ];

          this.mesAtual = new Date(this.listaDespesasOriginal[0].data)
            .toLocaleDateString('pt-BR', { month: 'long' })
            .replace(/^./, (letra) => letra.toUpperCase());

          this.gastoTotalEssencial = this.listaDespesasMesAtual
            .filter(
              (l) => l.despesa.categoria.tipo === TipoCategoriaEnum.Essencial,
            )
            .reduce((acc, l) => acc + Math.round(l.valor * 100), 0);

          this.gastoTotalNaoEssencial = this.listaDespesasMesAtual
            .filter(
              (l) =>
                l.despesa.categoria.tipo === TipoCategoriaEnum.NaoEssencial,
            )
            .reduce((acc, l) => acc + Math.round(l.valor * 100), 0);

          this.gastoTotalInvestimento = this.listaDespesasMesAtual
            .filter(
              (l) =>
                l.despesa.categoria.tipo === TipoCategoriaEnum.Investimento,
            )
            .reduce((acc, l) => acc + Math.round(l.valor * 100), 0);

          this.totalGastoEmergencial = this.listaDespesasMesAtual
            .filter(
              (l) => l.despesa.categoria.tipo === TipoCategoriaEnum.Emergencial,
            )
            .reduce((acc, l) => acc + Math.round(l.valor * 100), 0);

          this.total =
            this.gastoTotalEssencial +
            this.gastoTotalNaoEssencial +
            this.gastoTotalInvestimento +
            this.totalGastoEmergencial;

          if (this.listaDespesasMesAtual) {
            this.listaDespesasMesAtual = this.checarDespesaUsuario
              ? this.listaDespesasOriginal.filter(
                  (d) =>
                    d.despesa.usuario.id ===
                      this.tokenService.obterUsuarioLogado().id &&
                    d.despesa.categoria.tipo !== 5,
                )
              : this.listaDespesasOriginal.filter(
                  (d) =>
                    d.despesa.usuario.id === 1 &&
                    d.despesa.categoria.tipo !== 5,
                );

            const total = this.listaDespesasMesAtual.reduce(
              (acc, l) => acc + Math.round(l.valor * 100),
              0,
            );

            const totalFinal = total / 100;
            this.totalDespesas = totalFinal;

            this.atualizarRelatorio();
          }

          try {
            this.cd.detectChanges();
            this.loadingService.hide();
          } catch (e) {
            // ignore
            this.loadingService.hide();
          }
        });
      });
  }

  buscarReceita() {
    this.despesasService
      .listarReceitas()
      .subscribe((response: DespesaRequest[]) => {
        const receita = response?.[0]?.valor ?? 0;

        Promise.resolve().then(() => {
          this.receita = receita;

          this.limiteEssencial = receita * 0.5 * 100;
          this.limiteNaoEssencial = receita * 0.3 * 100;
          this.limiteInvestimento = receita * 0.2 * 100;

          try {
            this.cd.detectChanges();
          } catch (e) {
            // ignore if view destroyed
          }
        });
      });
  }

  atualizarRelatorio() {
    const categoriasMapGlobal = new Map<number, CategoriaResponse>();
    const tiposMap = new Map<number, TreeNode>();

    const totalGeral =
      this.listaDespesasMesAtual.reduce(
        (acc, l) => acc + Math.round(l.valor * 100),
        0,
      ) / 100;

    this.listaDespesasMesAtual.forEach((l) => {
      const categoria = l.despesa.categoria;
      const tipo = l.despesa.categoria.tipo;
      const valor = l.valor;

      this.listaDespesasMesAtual = this.checarDespesaUsuario
        ? this.listaDespesasOriginal.filter((d) => d.despesa.usuario.id === 1)
        : this.listaDespesasOriginal.filter(
            (d) =>
              d.despesa.usuario.id == this.tokenService.obterUsuarioLogado().id,
          );

      if (!categoriasMapGlobal.has(categoria.id)) {
        categoriasMapGlobal.set(categoria.id, categoria);
      }

      if (!tiposMap.has(tipo)) {
        tiposMap.set(tipo, {
          label: `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])}`,
          children: [],
          data: {
            total: 0,
            categoriasMap: new Map<number, TreeNode>(),
            tipo: tipo,
            percentual: 0,
          },
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

      categoriaNode.children!.push({
        label: `${l.despesa.descricao}`,
        data: l,
        parent: categoriaNode,
      });

      categoriaNode.data.total += valor;
      categoriaNode.label = `${categoria.nome} `;

      tipoNode.data.total += valor;
      tipoNode.label = `${TipoCategoriaUtilService.formatar(TipoCategoriaEnum[tipo])}`;
    });

    this.categorias = Array.from(categoriasMapGlobal.values());
    this.arvores = Array.from(tiposMap.values());
    this.calcularPercentuais(this.arvores, totalGeral);

    const tipoInicial = this.arvores.find((t) => t.data?.tipo === 1);

    if (tipoInicial) {
      this.tipoGraficoExbido = 'Essencial';

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
        categoriaNode.data.percentual = this.calcularPercentual(
          totalTipo,
          totalCategoria,
        );
      });
    });
  }

  get percentualEssencial() {
    return (this.gastoTotalEssencial / this.limiteEssencial) * 100;
  }

  get percentualNaoEssencial() {
    return (this.gastoTotalNaoEssencial / this.limiteNaoEssencial) * 100;
  }

  get percentualInvestimento() {
    return (this.gastoTotalInvestimento / this.limiteInvestimento) * 100;
  }

  get porcentagemEmergencial() {
    return (this.totalGastoEmergencial / 100 / this.receita) * 100;
  }

  get porcentagemUsoRenda(): number {
    if (!this.receita) {
      return 0;
    }

    return (this.total / 100 / this.receita) * 100;
  }

  buscarDespesaMesFuturo() {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + 1);
    this.mesDespesas = this.dataAtual
      .toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^./, (letra) => letra.toUpperCase());

    this.buscarDespesasMesInformado();
  }

  buscarDespesaMesAnterior() {
    this.dataAtual.setMonth(this.dataAtual.getMonth() - 1);
    this.buscarDespesasMesInformado();
    this.mesDespesas = this.dataAtual
      .toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^./, (letra) => letra.toUpperCase());

    // this.dataEscolhidaRelatorioEmitt.emit(this.dataAtual);
  }
}
