import { CategoriaResponse } from './../../models/categoria-response.model';
import { CategoriaService } from './../../services/categoria.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TreeModule } from 'primeng/tree';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { ScrollerModule } from 'primeng/scroller';
import { Button } from 'primeng/button';
import { EditarCategoriaComponent } from '../editar-categoria/editar-categoria.component';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { TipoCategoriaUtilService } from '../../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';

@Component({
  selector: 'app-gerenciar-categorias',
  imports: [CardModule, TreeModule, ScrollerModule, Button, EditarCategoriaComponent],
  templateUrl: './gerenciar-categorias.component.html',
  styleUrl: './gerenciar-categorias.component.css',
})
export class GerenciarCategoriasComponent {
  @Output() fecharTelaEmitter = new EventEmitter();
  categorias!: TreeNode[];
  listaCategorias: CategoriaResponse[] = [];
  editaCategoria: boolean = false;
  categoriaSelecionada!: CategoriaResponse;

  constructor(
    private readonly categoriaService: CategoriaService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.buscarCategorias();
  }

  buscarCategorias() {
    this.loadingService.show();

    this.categoriaService.listarCategorias().subscribe({
      next: (response: CategoriaResponse[]) => {
        this.categorias = Object.keys(TipoCategoriaEnum)
          .filter((k) => isNaN(Number(k)))
          .map((tipoNome, index) => {
            const tipoEnum = TipoCategoriaEnum[tipoNome as keyof typeof TipoCategoriaEnum];

            const filhos = response
              .filter((c) => c.tipo === tipoEnum)
              .map((c) => ({
                key: `${c.id}`,
                label: c.nome,
                leaf: true,
              }));

            return {
              key: `tipo-${index}`,
              label: TipoCategoriaUtilService.formatar(tipoNome),
              expanded: true,
              data: {
                tipo: tipoEnum,
              },
              children: filhos,
              leaf: false,
            };
          });

        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      },
    });
  }

  editarCategoria(item: any) {
    this.editaCategoria = true;
    const response: CategoriaResponse = {
      id: Number(item.key),
      nome: item.label,
      tipo: item.parent.data.tipo,
    };

    this.categoriaSelecionada = response;
  }

  atualizarCategoriaEditada(item: CategoriaResponse) {
    let itemMovido: any = null;

    this.categorias.forEach((pai) => {
      if (!pai.children) return;

      const index = pai.children.findIndex((filho) => filho.key == item.id.toString());

      if (index !== -1) {
        itemMovido = pai.children[index];
        pai.children.splice(index, 1);
      }
    });

    if (!itemMovido) return;

    itemMovido.label = item.nome;
    itemMovido.parent.data.tipo = item.tipo;

    const nomeTipo = TipoCategoriaEnum[item.tipo] as string;

    const novoPai = this.categorias.find(
      (p) =>
        TipoCategoriaUtilService.normalizar(p.label) ===
        TipoCategoriaUtilService.normalizar(nomeTipo),
    );

    if (novoPai) {
      if (!novoPai.children) novoPai.children = [];
      novoPai.children.push(itemMovido);
      novoPai.expanded = true;
    }

    this.categorias = [...this.categorias];
    this.editaCategoria = false;
  }

  fecharTela() {
    this.fecharTelaEmitter.emit();
  }
}
