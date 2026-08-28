import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InvestimentoService } from '../../services/investimento.service';
import { InvestimentoRequest } from '../../models/investimento-request.model';
import { InvestimentoResponse } from '../../models/investimento.model';
import { Router } from '@angular/router';
import { ListboxModule, Listbox } from 'primeng/listbox';

@Component({
  selector: 'app-relatorio-investimento',
  imports: [CardModule, Button, CurrencyPipe, Listbox, DatePipe],
  templateUrl: './relatorio-investimento.component.html',
  styleUrl: './relatorio-investimento.component.css',
})
export class RelatorioInvestimentoComponent {
  investimentoEmergencia = 0;
  investimento = 0;
  totalRetirada = 0;
  retiradas!: InvestimentoResponse[];
  pagamentos!: InvestimentoResponse[];
  totalPagamentoDivida = 0;
  valorDivida = 0;

  constructor(
    private readonly investimentoService: InvestimentoService,
    private readonly cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.buscarInvestimentos();
  }

  private buscarInvestimentos(): void {
    this.investimentoService
      .listarInvestimentos()
      .subscribe((investimentos) => {
        this.calcular(investimentos);
        this.retiradas = investimentos.filter((i) => i.tipo === 2);
        this.pagamentos = investimentos.filter((i) => i.tipo === 3);
      });
  }

  private calcular(investimentos: InvestimentoResponse[]): void {
    Promise.resolve().then(() => {
      this.investimento = investimentos
        .filter((i) => i.tipo !== 2)
        .reduce((total, investimento) => total + investimento.valor, 0);

      this.investimentoEmergencia = investimentos
        .filter((i) => i.tipo === 0)
        .reduce((total, investimento) => total + investimento.valor, 0);

      this.totalRetirada = investimentos
        .filter((i) => i.tipo === 2)
        .reduce((total, investimento) => total + investimento.valor, 0);

      this.totalPagamentoDivida = investimentos
        .filter((i) => i.tipo === 3)
        .reduce((total, investimento) => total + investimento.valor, 0);

      this.investimentoEmergencia += this.totalPagamentoDivida;

      this.valorDivida = this.totalRetirada - this.totalPagamentoDivida;
      try {
        this.cd.detectChanges();
      } catch {
        // ignore
      }
    });
  }

  abrirModalCadastroInvestimento(tipoInvestimento: number) {
    this.router.navigate([`/investimentos/${tipoInvestimento}`]);
  }
}
