import { Component, EventEmitter, NgZone, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { TokenService } from '../../../../shared/services/token/token.service';
import { CartaoService } from '../../../cartoes/services/cartao.service';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { TipoPagamentoService } from '../../../tipo-pagamentos/services/tipo-pagamento.service';
import { DespesasService } from '../../services/despesas.service';
import { CartaoResponse } from '../../../cartoes/models/cartao-response.model';
import { CategoriaResponse } from '../../../categorias/models/categoria-response.model';
import { TipoPagamentoResponse } from '../../../tipo-pagamentos/models/tipo-pagamento-response.model';
import { DespesaRequest } from '../../models/despesa-request.model';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { Button } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-cadastro-despesa',
  imports: [
    Button,
    RadioButton,
    Select,
    DatePicker,
    CurrencyPipe,
    NgClass,
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    InputNumberModule,
  ],
  templateUrl: './cadastro-despesa.component.html',
  styleUrl: './cadastro-despesa.component.css',
})
export class CadastroDespesaComponent {
  @Output() fecharTelaEmitter = new EventEmitter();
  recorrente: boolean = false;
  compartilhada = false;
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
  usuarioLogado: number = 0;
  cadastrando: boolean = false;
  telaPronta = false;

  constructor(
    private fb: FormBuilder,
    private readonly despesaService: DespesasService,
    private readonly tipoPagamentoService: TipoPagamentoService,
    private readonly categoriaService: CategoriaService,
    private readonly cartaoService: CartaoService,
    private readonly tokenService: TokenService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.criarFormulario();
    this.carregarDados();
    this.validarParcelaEscolhida();
    this.validarTipoPagamentoSelecionado();
  }

  criarFormulario() {
    this.formulario = this.fb.group({
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      data: [new Date(), Validators.required],
      categoria: ['', Validators.required],
      tipoPagamento: ['', Validators.required],
      parcela: [null, Validators.required],
      recorrencia: [4, Validators.required],
    });
  }

  cadastrarDespesaFechando() {
    this.cadastrando = true;
    this.cadastrarDespesa().subscribe({
      next: () => {
        this.formulario.reset();
        this.cadastrando = false;
        this.fecharTelaEmitter.emit();
      },
      error: () => {
        this.formulario.reset();
        this.cadastrando = false;
      },
    });
  }

  cadastrarDespesaContinuando() {
    this.cadastrando = true;
    this.cadastrarDespesa().subscribe({
      next: () => {
        this.formulario.reset();
        this.cadastrando = false;
      },
      error: () => {
        this.formulario.reset();
        this.cadastrando = false;
      },
    });
  }

  carregarDados() {
    this.loadingService.show();

    forkJoin({
      listaTipoPagamento: this.tipoPagamentoService.listarTiposPagamento(),
      cartoes: this.cartaoService.listarCartoes(),
      categorias: this.categoriaService.listarCategorias(),
    }).subscribe({
      next: ({ listaTipoPagamento, cartoes, categorias }) => {
        this.listaTipoPagamento = listaTipoPagamento;
        ((this.listaCartao = cartoes), (this.listaCategoria = categorias));

        this.agruparItensParaListaTipoPagamento();
        this.agruparItensParaListaCategoria();

        this.telaPronta = true;
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
      },
    });
  }

  cadastrarDespesa(): Observable<any> {
    const valores = this.formulario.value;

    const request: DespesaRequest = {
      descricao: valores.descricao,
      data: valores.data.toISOString(),
      valor: valores.valor,
      idCategoria: valores.categoria.value,
      idRecorrencia: valores.recorrencia,
      idTipoPagamento: this.idTipoPagamento,
      idCartao: this.idCartaoSelecionado,
      idUsuario: this.compartilhada === true ? 1 : this.tokenService.obterUsuarioLogado().id,
      parcela: valores.parcela ?? 1,
    };

    return this.despesaService.cadastrarDespesa(request);
  }

  buscaEncadeadaTipoPagamentoCartao() {
    this.loadingService.show();
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
          this.loadingService.hide();
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

  validarTipoPagamentoSelecionado() {
    this.formulario.get('tipoPagamento')?.valueChanges.subscribe((valor) => {
      if (valor?.tipo == 'contas') {
        this.idTipoPagamento = valor.value;
      } else if (valor) {
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

  fecharTela() {
    this.formulario.reset();
    this.fecharTelaEmitter.emit();
  }
}
