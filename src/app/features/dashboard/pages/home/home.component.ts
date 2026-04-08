import { Component } from '@angular/core';
import { Principal } from '../../components/principal/principal';
import { ExibirDespesasComponent } from '../../components/exibir-despesas/exibir-despesas.component';
import { ExibirCartoes } from '../../components/exibir-cartoes/exibir-cartoes';
import { DespesasService } from '../../../despesas/services/despesas.service';
import { DespesaResponse } from '../../../despesas/models/despesa-response.model';
import { FaturaResponse } from '../../../faturas/models/faturas-response.model';
import { InformacaoFaturasAgrupadas } from '../../../faturas/models/informacao-faturas-agrupada.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Principal, ExibirDespesasComponent, ExibirCartoes, ProgressSpinnerModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  listaDespesaMesAtual: DespesaResponse[] = [];
  valorTotalDespesasMes: number = 0;
  listaFaturas: FaturaResponse[] = [];
  listaAgrupada: InformacaoFaturasAgrupadas[] = [];
  carregando = false;

  constructor(
    private readonly despesaService: DespesasService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.buscarDespesasMesAtual();
  }

  buscarDespesasMesAtual() {
    this.loadingService.show();
    const mesAtual = new Date().getMonth() + 2;
    this.despesaService.listarDespesasMesInformado(mesAtual).subscribe({
      next: (retorno: DespesaResponse[]) => {
        this.listaDespesaMesAtual = retorno;
        this.valorTotalDespesasMes = (this.listaDespesaMesAtual || []).reduce(
          (total, despesa) => total + Number(despesa.valor || 0),
          0,
        );

        this.agruparDespesasFaturaCartao();
        this.loadingService.hide();
      },
      error: (erro) => {
        this.loadingService.hide();
      },
    });
  }

  private agruparDespesasFaturaCartao() {
    this.listaAgrupada = Object.values(
      this.listaDespesaMesAtual.reduce(
        (acc, despesa) => {
          const fatura = despesa.fatura;
          const cartao = fatura?.cartao;

          if (!fatura || !cartao) return acc;

          const key = `${cartao.id}-${fatura.id}`;

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
}
