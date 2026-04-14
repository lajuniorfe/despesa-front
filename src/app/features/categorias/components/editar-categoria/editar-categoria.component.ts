import { CategoriaService } from './../../services/categoria.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CategoriaResponse } from '../../models/categoria-response.model';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CategoriaRequest } from '../../models/categoria-request.model';
import { InputTextModule } from 'primeng/inputtext';
import { TipoCategoriaUtilService } from '../../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';

@Component({
  selector: 'app-editar-categoria',
  imports: [CardModule, ReactiveFormsModule, SelectModule, ButtonModule, InputTextModule],
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.css',
})
export class EditarCategoriaComponent {
  formulario!: FormGroup;
  @Input() categoriaRecebida!: CategoriaResponse;
  @Output() emitirCategoriaAlterada = new EventEmitter<CategoriaResponse>();
  @Output() emitirFecharEditarCategoria = new EventEmitter();
  grupoTipoCategoria!: any[];
  cadastrando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly categoriaService: CategoriaService,
  ) {}

  ngOnInit() {
    if (this.categoriaRecebida) {
      this.criarFormulario();

      this.grupoTipoCategoria = Object.keys(TipoCategoriaEnum)
        .filter((k) => isNaN(Number(k)))
        .map((key) => ({
          label: TipoCategoriaUtilService.formatar(key),
          value: TipoCategoriaEnum[key as keyof typeof TipoCategoriaEnum],
        }));
    }
  }

  criarFormulario() {
    this.formulario = this.fb.group({
      nome: [this.categoriaRecebida.nome, Validators.required],
      tipo: [this.categoriaRecebida.tipo, Validators.required],
    });
  }

  salvarCategoria() {
    this.cadastrando = true;
    const valores = this.formulario.value;

    const request: CategoriaRequest = {
      nome: valores.nome,
      tipo: valores.tipo,
    };

    this.categoriaService.editarCategoria(this.categoriaRecebida.id, request).subscribe({
      next: (retorno: CategoriaResponse) => {
        this.cadastrando = false;
        this.emitirCategoriaAlterada.emit(retorno);
      },
      error: (err) => {
        this.cadastrando = false;
      },
    });
  }

  fecharTela() {
    this.emitirFecharEditarCategoria.emit();
  }
}
