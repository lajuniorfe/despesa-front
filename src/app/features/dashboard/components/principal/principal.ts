import { Component } from '@angular/core';
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
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {
  usuario = 'Júnior';
  receitasMesAtual = 'R$ 13.250,00';
  despesasMesAtual = 'R$ 12.140,00';
  mesAtual = 'Abril';
  totalFaturas = 'R$ 4.364,34';
  totalIndividual = 'R$ 4.364,34';
}
