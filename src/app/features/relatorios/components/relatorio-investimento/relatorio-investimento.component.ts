import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InvestimentoService } from '../../services/investimento.service';
import { InvestimentoRequest } from '../../models/investimento-request.model';

@Component({
  selector: 'app-relatorio-investimento',
  imports: [CardModule, Button, CurrencyPipe],
  templateUrl: './relatorio-investimento.component.html',
  styleUrl: './relatorio-investimento.component.css',
})
export class RelatorioInvestimentoComponent {
  investimentoEmergencia: number = 0;
  investimento: number = 0;
  totalRetirada: number = 0;

 constructor(private readonly investimentoService: InvestimentoService) {}

 ngOnInit() {
  this.buscarInvestimentos();
 }

  buscarInvestimentos(){
    this.investimentoService.listarInvestimentos().subscribe((investimentos) => {

      this.investimento = investimentos.filter((i) => i.tipo !== 2).reduce((total, investimento) => total + investimento.valor, 0);
     
      this.investimentoEmergencia = investimentos.filter((i) => i.tipo === 0)
       .reduce((total, investimento) => total + investimento.valor, 0);

      this.totalRetirada = investimentos.filter((i) => i.tipo === 2)
       .reduce((total, investimento) => total + investimento.valor, 0);


    });
  }

  cadastrarInvestimento(){
    let request = new InvestimentoRequest();

    this.investimentoService.cadastrarInvestimento(request)
    .subscribe((response) => {
      this.buscarInvestimentos();
    });
  }
}
