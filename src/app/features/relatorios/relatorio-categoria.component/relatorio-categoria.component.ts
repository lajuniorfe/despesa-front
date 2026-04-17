import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TipoCategoriaEnum } from '../../../shared/enums/tipoCategora.enum';
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

  toggle(node: any) {
    this.selecionado(node);
    node.expanded = !node.expanded;
  }

  selecionado(node: any) {
    const texto = node.label.split('----------')[0].trim();
    const tipoSelecionado = this.encontrarTipo(node);
    let textoEnum = TipoCategoriaUtilService.normalizarParaEnum(texto);

    if (!(textoEnum in TipoCategoriaEnum)) return;

    setTimeout(() => {
      this.arvores?.forEach((n) => {
        n.expanded = n === tipoSelecionado;
      });

      this.arvores = [...this.arvores!];
    });

    this.iniciarGraficoEmit.emit(node);
    this.tipoGraficoExbido = texto;
  }

  encontrarTipo(nodeSelecionado: TreeNode): TreeNode | undefined {
    return this.arvores?.find((tipo) => this.nodePertence(tipo, nodeSelecionado));
  }

  nodePertence(pai: TreeNode, filho: TreeNode): boolean {
    if (pai === filho) return true;

    if (!pai.children) return false;

    return pai.children.some((c) => this.nodePertence(c, filho));
  }
}
