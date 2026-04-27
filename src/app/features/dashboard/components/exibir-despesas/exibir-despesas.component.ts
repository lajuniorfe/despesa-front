import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabList, Tabs, TabsModule } from 'primeng/tabs';
import { TokenService } from '../../../../shared/services/token/token.service';
import { DespesaRelacionamentoResponse } from '../../../despesas/models/retorno-despesa.model';
import { TipoCategoriaEnum } from './../../../../shared/enums/tipoCategora.enum';

@Component({
  selector: 'app-exibir-despesas',
  imports: [
    Tabs,
    TabList,
    TabsModule,
    TableModule,
    DataViewModule,
    ButtonModule,
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
  ],
  templateUrl: './exibir-despesas.component.html',
  styleUrl: './exibir-despesas.component.css',
})
export class ExibirDespesasComponent {
  tipoCategoriaEnum = TipoCategoriaEnum;
  @Input() listaDespesasRecebida: DespesaRelacionamentoResponse[] = [];
  listaDespesasConjuntas: DespesaRelacionamentoResponse[] = [];
  listaDespesasIndividuais: DespesaRelacionamentoResponse[] = [];
  valorTotalIndividual = 0;
  valorTotalCasal = 0;

  constructor(private readonly tokenService: TokenService) {}

  ngOnChanges() {
    if (this.listaDespesasRecebida.length > 0) {
      const usuarioLogado = this.tokenService.obterUsuarioLogado();

      this.listaDespesasConjuntas = this.listaDespesasRecebida.filter(
        (d) => d.despesa.usuario.id == 1,
      );
      this.valorTotalCasal = this.listaDespesasConjuntas.reduce(
        (total, despesa) => total + Number(despesa.valor || 0),
        0,
      );

      this.listaDespesasIndividuais = this.listaDespesasRecebida.filter(
        (d) => d.despesa.usuario.id == usuarioLogado.id,
      );

      this.valorTotalIndividual = this.listaDespesasIndividuais.reduce(
        (total, despesa) => total + Number(despesa.valor || 0),
        0,
      );
    }
  }
}
