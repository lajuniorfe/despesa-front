import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { DespesaRelacionamentoResponse } from '../../../despesas/models/retorno-despesa.model';
import { InformacaoFaturasAgrupadas } from '../../models/informacao-faturas-agrupada.model';

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
  @Output() abrirDetalhesDespesaEmitir = new EventEmitter<any>();

  selectedProduct!: DespesaRelacionamentoResponse;
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

  onRowSelect(event: any) {
    this.abrirDetalhesDespesaEmitir.emit(event.data);
  }
}
