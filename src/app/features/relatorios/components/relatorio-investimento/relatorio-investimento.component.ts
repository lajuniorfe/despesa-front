import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-relatorio-investimento',
  imports: [CardModule, Button, CurrencyPipe],
  templateUrl: './relatorio-investimento.component.html',
  styleUrl: './relatorio-investimento.component.css',
})
export class RelatorioInvestimentoComponent {
  investimentoEmergencia: number = 548303 / 100;
  investimento: number = (314480 + 155142) / 100;
  totalRetirada: number = (300000 + 466000) / 100;
  aporteDivida: number = 0;
  retiradaMesAtual: number = 0;
}
