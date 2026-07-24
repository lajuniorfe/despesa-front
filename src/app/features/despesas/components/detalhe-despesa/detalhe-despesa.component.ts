import { CurrencyPipe, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { forkJoin } from 'rxjs';
import { TipoCategoriaEnum } from '../../../../shared/enums/tipoCategora.enum';
import { TokenService } from '../../../../shared/services/token/token.service';
import { TipoCategoriaUtilService } from '../../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';
import { CartaoResponse } from '../../../cartoes/models/cartao-response.model';
import { CartaoService } from '../../../cartoes/services/cartao.service';
import { CategoriaResponse } from '../../../categorias/models/categoria-response.model';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { TipoPagamentoResponse } from '../../../tipo-pagamentos/models/tipo-pagamento-response.model';
import { TipoPagamentoService } from '../../../tipo-pagamentos/services/tipo-pagamento.service';
import { AlterarDespesaRequest } from '../../models/despesa-request-alterar.model';
import { DespesaRelacionamentoResponse } from '../../models/retorno-despesa.model';
import { DespesasService } from '../../services/despesas.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { AlertaService } from '../../../../shared/components/emitir-alerta/emitir-alerta.service';

@Component({
  selector: 'app-detalhe-despesa',
  imports: [
    Button,
    DatePicker,
    InputNumberModule,
    CardModule,
    ReactiveFormsModule,
    IftaLabelModule,
    InputTextModule,
    RadioButton,
    CurrencyPipe,
    Select,
    NgClass,
    ConfirmPopup,
  ],
  templateUrl: './detalhe-despesa.component.html',
  styleUrl: './detalhe-despesa.component.css',
})
export class DetalheDespesaComponent {
  @Input() despesaRecebida!: DespesaRelacionamentoResponse;
  @Output() fecharTelaEmitir = new EventEmitter();
  formulario!: FormGroup;
  compartilhada: boolean = false;
  recorrente: boolean = false;
  numeroParcela: number = 0;
  valorParcelas: number = 0;
  listaTipoPagamento: TipoPagamentoResponse[] = [];
  listaCategoria: CategoriaResponse[] = [];
  listaCartao: CartaoResponse[] = [];
  grupoTipoPagamento: any[] | null = null;
  grupoTipoCategoria: any[] | null = null;
  valorInicial: any;
  formAlterado = false;
  idCartaoSelecionado: number = 0;

  constructor(
    private fb: FormBuilder,
    private readonly tipoPagamentoService: TipoPagamentoService,
    private readonly categoriaService: CategoriaService,
    private readonly cartaoService: CartaoService,
    private readonly tokenService: TokenService,
    private readonly despesaService: DespesasService,
    private loadingService: LoadingService,
    private alertaService: AlertaService,
  ) {}

  ngOnInit() {
    if (this.despesaRecebida) {
      this.criarFormulario();
      this.carregarDados();

      this.recorrente = this.despesaRecebida.totalParcela > 1 ? true : false;
      if (this.despesaRecebida.totalParcela > 1) {
        this.recorrente = true;
        this.numeroParcela = this.despesaRecebida.totalParcela;
        this.valorParcelas = this.despesaRecebida.valor;
      }
    }

    this.formulario.get('parcela')?.valueChanges.subscribe((parcela) => {
      this.numeroParcela = parcela;
      this.recalcularValorParcelas(this.formulario.value.valor);
    });

    this.formulario.get('valor')?.valueChanges.subscribe((valor) => {
      this.recalcularValorParcelas(valor);
    });
  }

  recalcularValorParcelas(valor: number) {
    this.valorParcelas = valor / this.numeroParcela;
  }

  criarFormulario() {
    const data = this.despesaRecebida.despesa.data
      ? new Date(this.despesaRecebida.despesa.data)
      : null;

    this.formulario = this.fb.group({
      descricao: [this.despesaRecebida.despesa.descricao, Validators.required],
      valor: [this.despesaRecebida.despesa.valor, Validators.required],
      data: [data, Validators.required],
      categoria: [null, Validators.required],
      tipoPagamento: [null, Validators.required],
      parcela: [this.despesaRecebida.totalParcela, Validators.required],
      recorrencia: [
        this.despesaRecebida.despesa.recorrencia.id,
        Validators.required,
      ],
    });

    this.validar();
  }

  validar() {
    if (this.despesaRecebida.despesa.recorrencia.id == 1) {
      this.recorrente = true;
    }

    if (this.despesaRecebida.despesa.usuario.id == 1) {
      this.compartilhada = true;
    }
  }

  formatar(label: any) {
    return TipoCategoriaUtilService.formatar(label);
  }

  carregarDados() {
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

        this.valorInicial = this.normalizar(this.formulario.value);

        // Escutar mudanças
        this.formulario.valueChanges.subscribe((valorAtual) => {
          this.formAlterado =
            JSON.stringify(this.normalizar(valorAtual)) !==
            JSON.stringify(this.valorInicial);
        });
      },
      error: (error) => {
        // this.loadingService.hide();
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

    let valorSelecionado = this.despesaRecebida.fatura
      ? this.despesaRecebida.fatura.cartao.id
      : this.despesaRecebida.despesa.tipoPagamento.id;

    const tipoSelecionada = this.grupoTipoPagamento
      ?.flatMap((grupo) => grupo.items)
      .find((c) => c.value === valorSelecionado);

    this.formulario.patchValue({
      tipoPagamento: tipoSelecionada,
    });
  }

  private agruparItensParaListaCategoria() {
    this.grupoTipoCategoria = [
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum.Essencial],
        value: 'essencial',
        icon: 'pi-bookmark-fill',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum.Essencial)
          .map((c) => ({ label: c.nome, value: c.id })),
      },
      {
        label: TipoCategoriaEnum[TipoCategoriaEnum['NaoEssencial']],
        value: 'naoEssencial',
        icon: 'pi-dollar',
        items: this.listaCategoria
          .filter((c) => c.tipo === TipoCategoriaEnum['NaoEssencial'])
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
    ];

    const categoriaSelecionada = this.grupoTipoCategoria
      ?.flatMap((grupo) => grupo.items)
      .find((c) => c.value === this.despesaRecebida.despesa.categoria.id);

    this.formulario.patchValue({
      categoria: categoriaSelecionada,
    });
  }

  async alterarDespesa(event: Event) {
    const confirmou = await this.alertaService.confirmar(
      event,
      'Deseja alterar a despesa?',
    );

    this.loadingService.show();
    const valores = this.formulario.value;
    let request: AlterarDespesaRequest = {} as AlterarDespesaRequest;
    request.idDespesa = this.despesaRecebida.despesa.id;
    request.descricao = valores.descricao;
    request.idUsuario =
      this.compartilhada === true
        ? 1
        : this.tokenService.obterUsuarioLogado().id;

    if (!confirmou) return;

    if (confirmou) {
      request.dataDespesa = valores.data.toISOString();
      request.valorDespesa = valores.valor;

      if (valores.tipoPagamento.tipo != 'contas') {
        request.idTipoPagamento = 1;
        request.idCartao = valores.tipoPagamento.value;
      } else {
        request.idTipoPagamento = valores.tipoPagamento.value;
        request.idCartao = 0;
      }

      request.parcela = valores.parcela ?? 1;
      request.idCategoria = valores.categoria.value;
      this.despesaService.alterarDespesa(request).subscribe({
        next: (retorno) => {
          this.despesaRecebida = retorno;
          this.loadingService.hide();
          this.fecharTelaEmitir.emit();
        },
        error: (err) => {
          console.log('retorno alterar erro', err);
          this.loadingService.hide();
        },
      });
    }
  }

  excluirDespesa() {
    this.loadingService.show();
    this.despesaService
      .excluirDespesa(this.despesaRecebida.despesa.id)
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.fecharTelaEmitir.emit();
        },
        error: (err) => {
          console.log('retorno alterar erro', err);
        },
      });
  }

  private normalizar(valor: any) {
    return {
      ...valor,
      data: valor.data ? new Date(valor.data).toISOString() : null,
    };
  }

  validarTipoPagamentoSelecionado() {
    this.formulario.get('tipoPagamento')?.valueChanges.subscribe((valor) => {
      if (valor) {
        this.idCartaoSelecionado = valor.value;
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscPressed() {
    this.fecharModal();
  }

  fecharModal() {
    this.fecharTelaEmitir.emit();
  }
}
