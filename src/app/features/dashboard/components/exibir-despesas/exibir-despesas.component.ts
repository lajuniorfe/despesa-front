import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
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
export class ExibirDespesasComponent implements OnChanges {
  tipoCategoriaEnum = TipoCategoriaEnum;
  @Input() listaDespesasRecebida: DespesaRelacionamentoResponse[] = [];
  @Output() abrirDetalhesDespesaEmitir = new EventEmitter<any>();
  listaDespesasConjuntas: DespesaRelacionamentoResponse[] = [];
  listaDespesasIndividuais: DespesaRelacionamentoResponse[] = [];
  valorTotalIndividual = 0;
  valorTotalCasal = 0;
  selectedDespesa: any | null = null;
  @ViewChild('dt') tabelaCasal!: Table;
  @ViewChild('dti') tabelaIndividual!: Table;

  constructor(private readonly tokenService: TokenService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listaDespesasRecebida']) {
      this.atualizarListas();
    }
  }

  private atualizarListas(): void {
    const usuarioLogado = this.tokenService.obterUsuarioLogado();

    this.listaDespesasConjuntas = this.ordenarPorData(
      this.listaDespesasRecebida.filter((d) => d.despesa.usuario.id == 1),
    );

    this.valorTotalCasal = this.listaDespesasConjuntas.reduce(
      (total, despesa) => total + Number(despesa.valor || 0),
      0,
    );

    this.listaDespesasIndividuais = this.ordenarPorData(
      this.listaDespesasRecebida.filter(
        (d) => d.despesa.usuario.id == usuarioLogado.id,
      ),
    );

    this.valorTotalIndividual = this.listaDespesasIndividuais.reduce(
      (total, despesa) => total + Number(despesa.valor || 0),
      0,
    );

    this.tabelaCasal?.reset();
    this.tabelaIndividual?.reset();
  }

  // ngOnChanges() {
  //   if (this.listaDespesasRecebida.length > 0) {
  //     const usuarioLogado = this.tokenService.obterUsuarioLogado();

  //     this.listaDespesasConjuntas = this.listaDespesasRecebida.filter(
  //       (d) => d.despesa.usuario.id == 1,
  //     );
  //     this.valorTotalCasal = this.listaDespesasConjuntas.reduce(
  //       (total, despesa) => total + Number(despesa.valor || 0),
  //       0,
  //     );

  //     this.listaDespesasIndividuais = this.listaDespesasRecebida.filter(
  //       (d) => d.despesa.usuario.id == usuarioLogado.id,
  //     );

  //     this.valorTotalIndividual = this.listaDespesasIndividuais.reduce(
  //       (total, despesa) => total + Number(despesa.valor || 0),
  //       0,
  //     );
  //   }
  // }

  onRowSelect(event: any): void {
    this.abrirDetalhesDespesaEmitir.emit(event.data);
  }

  private ordenarPorData(lista: DespesaRelacionamentoResponse[]) {
    return [...lista].sort((a, b) => {
      const dataA = new Date(a.despesa.data);
      const dataB = new Date(b.despesa.data);

      return dataB.getTime() - dataA.getTime();
    });
  }
}
