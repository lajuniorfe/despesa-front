import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Divider } from 'primeng/divider';
import { InformacaoFaturasAgrupadas } from '../../../faturas/models/informacao-faturas-agrupada.model';

@Component({
  selector: 'app-exibir-cartoes',
  imports: [ButtonModule, DataView, CommonModule, Divider],
  templateUrl: './exibir-cartoes.html',
  styleUrl: './exibir-cartoes.css',
})
export class ExibirCartoes {
  @Input() listaAgrupadas: InformacaoFaturasAgrupadas[] = [];
  totalFaturas = 0;

  ngOnChanges() {
    this.totalFaturas = this.listaAgrupadas.reduce(
      (total, cartao) => total + cartao.valorFatura,
      0,
    );
  }
}
