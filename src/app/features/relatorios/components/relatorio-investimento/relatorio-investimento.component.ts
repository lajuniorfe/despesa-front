import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InvestimentoService } from '../../services/investimento.service';
import { InvestimentoRequest } from '../../models/investimento-request.model';
import { InvestimentoResponse } from '../../models/investimento.model';

@Component({
  selector: 'app-relatorio-investimento',
  imports: [CardModule, Button, CurrencyPipe],
  templateUrl: './relatorio-investimento.component.html',
  styleUrl: './relatorio-investimento.component.css',
})
export class RelatorioInvestimentoComponent {
  investimentoEmergencia = 0;
  investimento = 0;
  totalRetirada = 0;

  constructor(private readonly investimentoService: InvestimentoService, private readonly cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.buscarInvestimentos();
  }

  private buscarInvestimentos(): void {
    this.investimentoService
      .listarInvestimentos()
      .subscribe((investimentos) => {
        this.calcular(investimentos);
      });
  }

  private calcular(investimentos: InvestimentoResponse[]): void {
    Promise.resolve().then(() => {
      this.investimento = investimentos.filter((i) => i.tipo !== 2).reduce((total, investimento) => total + investimento.valor, 0);

      this.investimentoEmergencia = investimentos.filter((i) => i.tipo === 0).reduce((total, investimento) => total + investimento.valor, 0);

      this.totalRetirada = investimentos.filter((i) => i.tipo === 2).reduce((total, investimento) => total + investimento.valor, 0);

      try {
        this.cd.detectChanges();
      } catch {
        // ignore
      }
    });
  }

  cadastrarInvestimento(): void {
    const request = new InvestimentoRequest();

    this.investimentoService.cadastrarInvestimento(request).subscribe(() => {
      // Atualiza cache/tela depois de cadastrar
      this.buscarInvestimentos();
    });
  }
}
