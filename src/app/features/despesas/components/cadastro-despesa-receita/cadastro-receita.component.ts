import { Component, EventEmitter, Output } from '@angular/core';
import { DespesaRelacionamentoResponse } from '../../models/retorno-despesa.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { TokenService } from '../../../../shared/services/token/token.service';
import { DespesasService } from '../../services/despesas.service';
import { DespesaRequest } from '../../models/despesa-request.model';
import { finalize, Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cadastro-receita',
  imports: [
    ButtonModule,
    RadioButton,
    InputNumberModule,
    DatePickerModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cadastro-receita.component.html',
  styleUrl: './cadastro-receita.component.css',
})
export class CadastroReceitaComponent {
  @Output() fecharTelaEmitter = new EventEmitter();
  @Output() retornarReceitaCadastradaEmitter = new EventEmitter<DespesaRelacionamentoResponse>();
  formulario!: FormGroup;
  usuarioLogado: number = 0;
  cadastrando: boolean = false;
  compartilhada: boolean = false;
  recorrente: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly despesaService: DespesasService,
    private loadingService: LoadingService,
    private readonly tokenService: TokenService,
  ) {}

  ngOnInit() {
    this.loadingService.show();
    this.criarFormulario();
  }

  criarFormulario() {
    this.formulario = this.fb.group({
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      data: [new Date(), Validators.required],
      recorrencia: [null, Validators.required],
    });
    this.loadingService.hide();
  }

  cadastrarReceita(): Observable<any> {
    const valores = this.formulario.value;

    this.compartilhada = true;

    const request: DespesaRequest = {
      descricao: valores.descricao,
      data: valores.data.toISOString(),
      valor: valores.valor,
      idCategoria: 31,
      idRecorrencia: valores.recorrencia ?? 4,
      idTipoPagamento: 2,
      idCartao: 0,
      idUsuario: this.compartilhada === true ? 1 : this.tokenService.obterUsuarioLogado().id,
      parcela: 1,
    };

    return this.despesaService.cadastrarDespesa(request);
  }

  cadastrarDespesaFechando() {
    this.cadastrando = true;
    this.cadastrarReceita()
      .pipe(finalize(() => (this.cadastrando = false)))
      .subscribe({
        next: (response: DespesaRelacionamentoResponse) => {
          this.formulario.reset();
          this.retornarReceitaCadastradaEmitter.emit(response);
          this.fecharTelaEmitter.emit();
        },
        error: () => {
          this.formulario.reset();
        },
      });
  }

  cadastrarDespesaContinuando() {
    this.cadastrando = true;
    this.cadastrarReceita()
      .pipe(finalize(() => (this.cadastrando = false)))
      .subscribe({
        next: (response: DespesaRelacionamentoResponse) => {
          this.formulario.reset();

          this.retornarReceitaCadastradaEmitter.emit(response);
        },
        error: () => {
          this.formulario.reset();
        },
      });
  }

  fecharTela() {
    this.formulario.reset();
    this.fecharTelaEmitter.emit();
  }
}
