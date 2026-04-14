import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InformacaoFaturasAgrupadas } from '../../models/informacao-faturas-agrupada.model';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { DespesaRelacionamentoResponse } from '../../../despesas/models/retorno-despesa.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-detalhar-faturas',
  imports: [
    CardModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './detalhar-faturas.component.html',
  styleUrl: './detalhar-faturas.component.css',
})
export class DetalharFaturasComponent {
  @Input() detalheFaturaAtual!: InformacaoFaturasAgrupadas;
  @Output() fecharTelaEmitir = new EventEmitter();

  mesFatura: string = '';
  tipoCategoriaEnum = TipoCategoriaEnum;
  listaDespesas: DespesaRelacionamentoResponse[] = [];
  valorTotalFatura = 0;

  ngOnInit() {
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

    const nomeMes = proximoMes.toLocaleString('pt-BR', { month: 'long' });
    const nomeMesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

    this.mesFatura = nomeMesFormatado;
  }

  ngOnChanges() {
    this.listaDespesas = this.detalheFaturaAtual.despesas;

    this.valorTotalFatura = this.listaDespesas.reduce(
      (total, despesa) => total + Number(despesa.valor || 0),
      0,
    );
  }

  fecharTela() {
    this.fecharTelaEmitir.emit();
  }
}
