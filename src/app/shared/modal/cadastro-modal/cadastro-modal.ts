import { ChangeDetectorRef, Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { DespesaRequest } from '../../../features/despesas/models/despesa-request.model';
import { DespesasService } from '../../../features/despesas/services/despesas.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { CurrencyPipe, NgComponentOutlet, NgClass } from '@angular/common';
import { TipoPagamentoService } from '../../../features/tipo-pagamentos/services/tipo-pagamento.service';
import { TipoPagamentoResponse } from '../../../features/tipo-pagamentos/models/tipo-pagamento-response.model';
import { CategoriaResponse } from '../../../features/categorias/models/categoria-response.model';
import { CategoriaService } from '../../../features/categorias/services/categoria.service';
import { CartaoResponse } from '../../../features/cartoes/models/cartao-response.model';
import { CartaoService } from '../../../features/cartoes/services/cartao.service';
import { switchMap } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TipoCategoriaEnum } from '../../enums/tipoCategora.enum';

@Component({
  selector: 'app-cadastro-modal',
  imports: [
    InputTextModule,
    Button,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    RadioButton,
    ReactiveFormsModule,
    RadioButtonModule,
    FormsModule,
    CurrencyPipe,
    ProgressSpinnerModule,
    NgClass,
  ],
  templateUrl: './cadastro-modal.html',
  styleUrl: './cadastro-modal.css',
})
export class CadastroModal {
  recorrente: boolean = false;
  carregando = false;
  idCartaoSelecionado: number = 0;
  idTipoPagamento: number = 0;
  numeroParcela: number = 0;
  valorParcelas: number = 0;
  formulario!: FormGroup;
  listaTipoPagamento: TipoPagamentoResponse[] = [];
  listaCategoria: CategoriaResponse[] = [];
  listaCartao: CartaoResponse[] = [];
  grupoTipoPagamento: any[] | null = null;
  grupoTipoCategoria: any[] | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly despesaService: DespesasService,
    private readonly tipoPagamentoService: TipoPagamentoService,
    private readonly categoriaService: CategoriaService,
    private readonly cartaoService: CartaoService,
    public ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buscaEncadeadaTipoPagamentoCartao();
    this.listarCategorias();
    this.criarFormulario();
    this.validarParcelaEscolhida();
    this.validarTipoPagamentoSelecionado();
  }

  criarFormulario() {
    this.formulario = this.fb.group({
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      data: ['', Validators.required],
      categoria: ['', Validators.required],
      tipoPagamento: ['', Validators.required],
      compartilhada: ['', Validators.required],
      parcela: [null, Validators.required],
      recorrencia: [4, Validators.required],
    });
  }

  cadastrarDespesaFechando() {
    this.cadastrarDespesa();
    this.fecharModal();
  }

  cadastrarDespesaContinuando() {
    this.cadastrarDespesa();
    this.formulario.reset();
  }

  cadastrarDespesa() {
    const valores = this.formulario.value;

    const request: DespesaRequest = {
      descricao: valores.descricao,
      data: valores.data.toISOString(),
      valor: valores.valor,
      idCategoria: valores.categoria.id,
      idRecorrencia: valores.recorrencia,
      idTipoPagamento: this.idTipoPagamento,
      idCartao: this.idCartaoSelecionado,
      idUsuario: 1,
      parcela: valores.parcela ?? 1,
    };

    this.despesaService.cadastrarDespesa(request).subscribe({
      next: () => {
        console.log('cadastrou');
      },
      error: (error) => {
        console.log('deu erro', error);
      },
    });
  }

  fecharModal() {
    this.formulario.reset();
    this.ref.close();
  }

  buscaEncadeadaTipoPagamentoCartao() {
    this.carregando = true;
    this.tipoPagamentoService
      .listarTiposPagamento()
      .pipe(
        switchMap((response: TipoPagamentoResponse[]) => {
          this.listaTipoPagamento = response;
          return this.cartaoService.listarCartoes();
        }),
      )
      .subscribe({
        next: (responseCartao: CartaoResponse[]) => {
          this.listaCartao = responseCartao;

          this.agruparItensParaListaTipoPagamento();
          this.carregando = false;
          this.cdr.detectChanges();
        },
      });
  }

  private agruparItensParaListaTipoPagamento() {
    this.grupoTipoPagamento = [
      {
        label: 'Contas',
        value: 'contas',
        items: this.listaTipoPagamento
          .filter((c) => c.nome !== 'Cartão de Crédito')
          .map((c) => ({
            label: c.nome,
            value: c.id,
            tipo: 'contas',
          })),
      },

      {
        label: 'Cartões',
        value: 'cartao',
        items: this.listaCartao.map((c) => ({
          label: c.nome,
          value: c.id,
          tipo: 'cartao',
        })),
      },
    ];
  }

  private agruparItensParaListaCategoria() {
    this.grupoTipoCategoria = [
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum.Essêncial],
        value: 'essencial',
        icon: 'pi-bookmark-fill',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum.Essêncial)
          .map((c) => ({ label: c.nome, value: c.id })),
      },
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum['Não Essêncial']],
        value: 'naoEssencial',
        icon: 'pi-dollar',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum['Não Essêncial'])
          .map((c) => ({ label: c.nome, value: c.id })),
      },
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum.Emergencial],
        value: 'emergencial',
        icon: 'pi-exclamation-triangle',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum.Emergencial)
          .map((c) => ({ label: c.nome, value: c.id })),
      },
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum.Investimento],
        value: 'investimento',
        icon: 'pi-wallet',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum.Investimento)
          .map((c) => ({ label: c.nome, value: c.id })),
      },
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum['Sem Categora']],
        value: 'semCategoria',
        icon: 'pi-times',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum['Sem Categora'])
          .map((c) => ({ label: c.nome, value: c.id })),
      },
    ];
  }

  private listarCategorias() {
    this.carregando = true;
    this.categoriaService.listarCategorias().subscribe({
      next: (response: CategoriaResponse[]) => {
        this.listaCategoria = response;
        console.log('categorias', this.listaCategoria);

        this.agruparItensParaListaCategoria();

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error(error) {},
    });
  }

  validarTipoPagamentoSelecionado() {
    this.formulario.get('tipoPagamento')?.valueChanges.subscribe((valor) => {
      if (valor.tipo == 'contas') {
        this.idTipoPagamento = valor.value;
      } else {
        //tipo pagamento é cartao
        this.idTipoPagamento = 1;
        this.idCartaoSelecionado = valor.value;
      }
    });
  }

  validarParcelaEscolhida() {
    this.formulario.get('parcela')?.valueChanges.subscribe((valor) => {
      this.numeroParcela = valor;
      this.valorParcelas = this.formulario.get('valor')?.value / this.numeroParcela;
    });
  }
}
