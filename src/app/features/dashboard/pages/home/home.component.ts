import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { TokenService } from '../../../../shared/services/token/token.service';
import { CadastroReceitaComponent } from '../../../despesas/components/cadastro-despesa-receita/cadastro-receita.component';
import { CadastroDespesaComponent } from '../../../despesas/components/cadastro/cadastro-despesa.component';
import { DetalheDespesaComponent } from '../../../despesas/components/detalhe-despesa/detalhe-despesa.component';
import { DespesaRelacionamentoResponse } from '../../../despesas/models/retorno-despesa.model';
import { DespesasService } from '../../../despesas/services/despesas.service';
import { DetalharFaturasComponent } from '../../../faturas/components/detalhar-faturas/detalhar-faturas.component';
import { FaturaResponse } from '../../../faturas/models/faturas-response.model';
import { InformacaoFaturasAgrupadas } from '../../../faturas/models/informacao-faturas-agrupada.model';
import { UsuarioResponse } from '../../../usuarios/models/usuario-response.model';
import { ExibirCartoes } from '../../components/exibir-cartoes/exibir-cartoes';
import { ExibirDespesasComponent } from '../../components/exibir-despesas/exibir-despesas.component';
import { Principal } from '../../components/principal/principal';
@Component({
  selector: 'app-home',
  imports: [
    Principal,
    ExibirDespesasComponent,
    ExibirCartoes,
    ProgressSpinnerModule,
    CommonModule,
    DetalharFaturasComponent,
    CadastroDespesaComponent,
    CadastroReceitaComponent,
    DetalheDespesaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  listaDespesaMesAtual: DespesaRelacionamentoResponse[] = [];
  valorTotalDespesasMes: number = 0;
  valorTotalDespesasIndividuais: number = 0;
  listaFaturas: FaturaResponse[] = [];
  listaAgrupada: InformacaoFaturasAgrupadas[] = [];
  faturaRecebida!: InformacaoFaturasAgrupadas;
  carregando = false;
  usuario!: UsuarioResponse;
  exibirDetalheFatura: boolean = false;
  saldoPrevisto: number = 0;
  saldoIndividual: number = 0;
  receitasMesAtual: number = 0;
  receitaIndividual: number = 0;
  mostrarCadastroDespesa: boolean = false;
  mostrarCadastroReceita: boolean = false;
  saldoIndividualUsuarioLogado: number = 0;
  saldoIndividualUsuarioOffline: number = 0;
  exbirDetalheDespesa: boolean = false;
  despesaDetalhar!: DespesaRelacionamentoResponse;

  constructor(
    private readonly despesaService: DespesasService,
    private loadingService: LoadingService,
    private readonly tokenService: TokenService,
  ) {}

  ngOnInit() {
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    this.buscarDespesasMesAtual(mesAtual, anoAtual);
  }

  buscarDespesasMesAtual(mesAtual: number, anoAtual: number) {
    this.usuario = this.tokenService.obterUsuarioLogado();
    this.loadingService.show();

    this.despesaService.listarDespesasMesInformado(mesAtual, anoAtual).subscribe({
      next: (retorno: DespesaRelacionamentoResponse[]) => {
        const listaDespesas = retorno.filter((d) => d.despesa.categoria.tipo !== 5);
        const listaReceitas = retorno.filter((d) => d.despesa.categoria.tipo === 5);

        this.listaDespesaMesAtual = listaDespesas;

        this.receitasMesAtual = this.calcularReceitaCasal(listaReceitas);
        this.receitaIndividual = this.calcularReceitaIndividual(listaReceitas);
        this.valorTotalDespesasMes = this.calcularValorTotalDespesasUsuario(1);

        sessionStorage.setItem('despesas', JSON.stringify(this.listaDespesaMesAtual));

        this.valorTotalDespesasIndividuais =
          this.calcularValorTotalDespesasIndividuaisUsuarioLogado();

        this.saldoPrevisto = this.calcularSaldoConjunto(this.valorTotalDespesasMes);
        this.saldoIndividual = this.calcularSaldoIndividual(
          this.saldoPrevisto,
          this.valorTotalDespesasIndividuais,
        );

        this.agruparDespesasFaturaCartao();
        this.loadingService.hide();
      },
      error: (erro) => {
        this.loadingService.hide();
      },
    });
  }

  calcularValorTotalDespesasUsuario(idUsuario: number) {
    return (this.listaDespesaMesAtual || [])
      .filter((d) => d.despesa.usuario.id == idUsuario)
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);
  }

  calcularReceitaCasal(receitas: DespesaRelacionamentoResponse[]) {
    return (receitas || [])
      .filter((d) => d.despesa.usuario.id == 1)
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);
  }

  calcularReceitaIndividual(receitas: DespesaRelacionamentoResponse[]) {
    return (receitas || [])
      .filter((d) => d.despesa.usuario.id == this.usuario.id)
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);
  }

  calcularValorTotalDespesasIndividuaisUsuarioLogado() {
    return (this.listaDespesaMesAtual || [])
      .filter((d) => d.despesa.usuario.id == this.usuario.id)
      .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);
  }

  calcularSaldoConjunto(valorDespesa: number): number {
    return this.receitasMesAtual - valorDespesa;
  }

  calcularSaldoIndividual(saldo: number, valorDespesa: number): number {
    return saldo / 2 + this.receitaIndividual - valorDespesa;
  }

  private agruparDespesasFaturaCartao() {
    this.listaAgrupada = Object.values(
      this.listaDespesaMesAtual.reduce(
        (acc, despesa) => {
          const fatura = despesa.fatura;
          const cartao = fatura?.cartao;

          if (!fatura || !cartao) return acc;

          const vencimento = new Date(fatura.vencimento);
          const key = `${cartao.id}-${vencimento.getMonth() + 1}-${vencimento.getFullYear()}`;

          if (!acc[key]) {
            acc[key] = {
              nomeCartao: cartao.nome,
              imagemCartao: cartao.imagem,
              valorFatura: 0,
              vencimento: new Date(fatura.vencimento),
              despesas: [],
            } as InformacaoFaturasAgrupadas;
          }

          acc[key].valorFatura += Number(despesa.valor || 0);
          acc[key].despesas.push(despesa);

          return acc;
        },
        {} as Record<string, InformacaoFaturasAgrupadas>,
      ),
    );
  }

  receberDespesaCadastrada(despesa: DespesaRelacionamentoResponse) {
    const dataDespesa = new Date(despesa.data);
    const dataLista = new Date(this.listaDespesaMesAtual[0].data);

    if (dataDespesa.getMonth() === dataLista.getMonth()) {
      this.listaDespesaMesAtual = [...this.listaDespesaMesAtual, despesa];

      this.agruparDespesasFaturaCartao();
      sessionStorage.setItem('despesas', JSON.stringify(this.listaDespesaMesAtual));
    }

    if (despesa.despesa.usuario.id === 1) {
      this.valorTotalDespesasMes += despesa.valor;
    } else {
      this.valorTotalDespesasIndividuais += despesa.valor;
    }

    this.saldoPrevisto = this.calcularSaldoConjunto(this.valorTotalDespesasMes);
    this.saldoIndividual = this.calcularSaldoIndividual(
      this.saldoPrevisto,
      this.valorTotalDespesasIndividuais,
    );
  }

  detalharFatura(faturaRecebida: InformacaoFaturasAgrupadas) {
    this.exibirDetalheFatura = true;
    this.faturaRecebida = faturaRecebida;
  }

  abrirDetalheDespesa(despesaRecebida: DespesaRelacionamentoResponse) {
    this.despesaDetalhar = despesaRecebida;
    this.exbirDetalheDespesa = true;
  }

  receberReceitaCadastrada(despesa: any) {
    //console.log('recebi', despesa);
  }

  cadastrarDespesa() {
    this.checarSaldo();
    this.mostrarCadastroDespesa = true;
  }

  cadastrarReceita() {
    this.mostrarCadastroReceita = true;
  }

  fecharCadastro() {
    this.mostrarCadastroDespesa = false;
  }

  fecharCadastroReceita() {
    this.mostrarCadastroReceita = false;
  }

  checarSaldo() {
    const despesaCasal = this.calcularValorTotalDespesasUsuario(1);
    const SaldoConjunto = this.calcularSaldoConjunto(despesaCasal);

    const despesaUsuarioLogado = this.calcularValorTotalDespesasIndividuaisUsuarioLogado();

    this.saldoIndividualUsuarioLogado = this.calcularSaldoIndividual(
      SaldoConjunto,
      despesaUsuarioLogado,
    );

    const despesaUsuarioOffLine = this.calcularValorTotalDespesasUsuario(3);
    this.saldoIndividualUsuarioOffline = this.calcularSaldoIndividual(
      SaldoConjunto,
      despesaUsuarioOffLine,
    );
  }

  dataBuscarDespesa(dataRecebida: Date) {
    const mesAtual = dataRecebida.getMonth() + 1;
    const anoAtual = dataRecebida.getFullYear();
    this.buscarDespesasMesAtual(mesAtual, anoAtual);
  }

  fecharDetalheDespesa() {
    this.exbirDetalheDespesa = false;
  }
}
