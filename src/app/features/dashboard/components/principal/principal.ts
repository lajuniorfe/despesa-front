import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../shared/services/token/token.service';
import { CadastroDespesaComponent } from '../../../despesas/components/cadastro/cadastro-despesa.component';
import { GerenciarCategoriasComponent } from '../../../categorias/components/gerenciar/gerenciar-categorias.component';
import { UsuarioResponse } from '../../../usuarios/models/usuario-response.model';
import { DespesaRelacionamentoResponse } from '../../../despesas/models/retorno-despesa.model';
import { HomeComponent } from '../../pages/home/home.component';
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
  usuario!: UsuarioResponse;
  mostrarCategorias: boolean = false;

  constructor(private readonly tokenService: TokenService) {}

  ngOnInit() {
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

  // receberDespesaCadastrada(despesa: DespesaRelacionamentoResponse) {
  //   this.despesaCadastradaEmit.emit(despesa);
  // }
}
