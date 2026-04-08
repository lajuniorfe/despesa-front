import { Component, Input } from '@angular/core';
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
import { UsuarioAutenticado } from '../../../usuarios/models/usuario-autenticado.model';
import { CadastroDespesaComponent } from '../../../despesas/components/cadastro/cadastro-despesa.component';
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
    CadastroDespesaComponent,
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {
  usuario!: UsuarioAutenticado;
  receitasMesAtual = 'R$ 13.250,00';
  @Input() valorDespesasMesAtual: number = 0;
  mesAtual = 'Abril';
  totalFaturas = 'R$ 4.364,34';
  totalIndividual = 'R$ 4.364,34';
  mostrarCadastro = false;

  constructor(private readonly tokenService: TokenService) {}

  ngOnInit() {
    this.usuario = this.tokenService.obterUsuarioLogado();
  }

  cadastrarDespesa() {
    this.mostrarCadastro = true;
  }

  fecharCadastro() {
    this.mostrarCadastro = false;
  }
}
