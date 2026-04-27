import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TokenService } from '../../../../shared/services/token/token.service';
import { GerenciarCategoriasComponent } from '../../../categorias/components/gerenciar/gerenciar-categorias.component';
import { UsuarioResponse } from '../../../usuarios/models/usuario-response.model';
@Component({
  selector: 'app-principal',
  imports: [
    ToolbarModule,
    ButtonModule,
    PanelModule,
    DividerModule,
    TooltipModule,
    TabsModule,
    TableModule,
    DataViewModule,
    TagModule,
    CommonModule,
    GerenciarCategoriasComponent,
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {
  @Input() valorDespesasConjuntasMesAtual: number = 0;
  @Input() valorDespesasIndividuaisMesAtual: number = 0;
  @Input() saldoIndividual: number = 0;
  @Input() receitasMesAtual: number = 0;
  @Input() receitaIndividual: number = 0;
  @Output() cadastrarDespesaEmit = new EventEmitter();
  @Output() cadastrarReceitaEmitt = new EventEmitter();
  @Output() dataEscolhidaEmitt = new EventEmitter<Date>();
  usuario!: UsuarioResponse;
  mostrarCategorias: boolean = false;
  dataAtual = new Date();
  mesDespesas = '';

  constructor(private readonly tokenService: TokenService) {}

  ngOnInit() {
    this.mesDespesas = this.dataAtual
      .toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^./, (letra) => letra.toUpperCase());

    this.usuario = this.tokenService.obterUsuarioLogado();
  }

  ngOnChanges() {}

  cadastrarDespesa() {
    this.cadastrarDespesaEmit.emit();
  }

  cadastrarReceita() {
    this.cadastrarReceitaEmitt.emit();
  }

  gerenciarCategorias() {
    this.mostrarCategorias = true;
  }

  fecharCategorias() {
    this.mostrarCategorias = false;
  }

  buscarDespesaMesFuturo() {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + 1);
    this.mesDespesas = this.dataAtual
      .toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^./, (letra) => letra.toUpperCase());

    this.dataEscolhidaEmitt.emit(this.dataAtual);
  }

  buscarDespesaMesAnterior() {
    this.dataAtual.setMonth(this.dataAtual.getMonth() - 1);
    this.mesDespesas = this.dataAtual
      .toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^./, (letra) => letra.toUpperCase());

    this.dataEscolhidaEmitt.emit(this.dataAtual);
  }
}
