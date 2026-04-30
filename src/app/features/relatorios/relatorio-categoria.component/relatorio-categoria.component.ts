import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';
import { CorCategoriaService } from '../../../shared/services/utils/cor-categoria/cor-categoria.service';
import { TipoCategoriaUtilService } from '../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';

@Component({
  selector: 'app-relatorio-categoria',
  imports: [ButtonModule, DividerModule, CommonModule],
  templateUrl: './relatorio-categoria.component.html',
  styleUrl: './relatorio-categoria.component.css',
})
export class RelatorioCategoriaComponent {
  @Input() arvores: TreeNode[] | null = null;
  @Input() tipoGraficoExbido: string = '';
  @Output() iniciarGraficoEmit = new EventEmitter<any>();
  selectedNode: any = null;

  constructor(private corService: CorCategoriaService) {}

  ngOnInit() {
    if (this.arvores) {
      this.selectedNode = this.arvores[0];
      this.selectedNode.expanded = true;
    }
  }

  selecionado(node: any) {
    const texto = node.label.split('----------')[0].trim();
    let textoEnum = TipoCategoriaUtilService.normalizarParaEnum(texto);

    if (!(textoEnum in TipoCategoriaEnum)) return;

    this.iniciarGraficoEmit.emit(node);
    this.tipoGraficoExbido = texto;
  }

  getClasseCor(node: any): string {
    const label = node.label.split('----------')[0].trim();
    return this.corService.getClasse(label);
  }

  selecionarNode(node: any, level: number) {
    if (level === 0) {
      this.selectedNode = this.selectedNode === node ? null : node;
    }
    this.selecionado(node);
    node.expanded = !node.expanded;
  }
}
