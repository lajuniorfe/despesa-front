import { Component, EventEmitter, inject, Input, NgZone, Output } from '@angular/core';
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
import { finalize, forkJoin, Observable, switchMap } from 'rxjs';
import { Button } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TipoCategoriaUtilService } from '../../../../shared/services/utils/tipo-categoria/tipo-categoria-util.service';
import { DespesaRelacionamentoResponse } from '../../models/retorno-despesa.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

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
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './cadastro-despesa.component.html',
  styleUrl: './cadastro-despesa.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CadastroDespesaComponent {
  @Output() fecharTelaEmitter = new EventEmitter();
  @Output() retornarDespesaCadastradaEmitter = new EventEmitter<DespesaRelacionamentoResponse>();
  // @Input() listaDespesasRecebida: DespesaRelacionamentoResponse[] = [];

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
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  @Input() saldoIndividualUsuarioLogado: number = 0;
  @Input() saldoIndividualUsuarioOffline: number = 0;

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
      recorrencia: [null, Validators.required],
    });
  }

  async cadastrarDespesaFechando(event: Event) {
    const valores = this.formulario.value;
    const valorDespesa = valores.parcela === null ? valores.valor : valores.valor / valores.parcela;
    const podeCadastrar = await this.checarSeDespesaUltrapassaOSaldoUsuarios(valorDespesa, event);

    if (!podeCadastrar) return;

    this.cadastrando = true;
    this.cadastrarDespesa()
      .pipe(finalize(() => (this.cadastrando = false)))
      .subscribe({
        next: (response: DespesaRelacionamentoResponse) => {
          this.formulario.reset();
          this.retornarDespesaCadastradaEmitter.emit(response);
          this.fecharTelaEmitter.emit();
        },
        error: () => {
          this.formulario.reset();
        },
      });
  }

  cadastrarDespesaContinuando() {
    this.cadastrando = true;
    this.cadastrarDespesa()
      .pipe(finalize(() => (this.cadastrando = false)))
      .subscribe({
        next: (response: DespesaRelacionamentoResponse) => {
          this.formulario.reset();

          this.retornarDespesaCadastradaEmitter.emit(response);
        },
        error: () => {
          this.formulario.reset();
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
      idRecorrencia: valores.recorrencia ?? 4,
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

  formatar(label: any) {
    return TipoCategoriaUtilService.formatar(label);
  }

  // calcularValorTotalDespesasIndividuais(idUsuario: number) {
  //   return (this.listaDespesasRecebida || [])
  //     .filter((d) => d.despesa.usuario.id == idUsuario)
  //     .reduce((total, despesa) => total + Number(despesa.valor || 0), 0);
  // }

  async checarSeDespesaUltrapassaOSaldoUsuarios(
    valorDespesa: number,
    event: Event,
  ): Promise<boolean> {
    // const despesaCasal = this.calcularValorTotalDespesasIndividuais(1);
    // const SaldoConjunto = this.calcularSaldoConjunto(despesaCasal);
    // const despesaUsuarioJunior = this.calcularValorTotalDespesasIndividuais(2);
    // const saldoJunior = this.calcularSaldoIndividual(SaldoConjunto, despesaUsuarioJunior);
    // const despesaUsuarioAllana = this.calcularValorTotalDespesasIndividuais(3);
    // const saldoAllana = this.calcularSaldoIndividual(SaldoConjunto, despesaUsuarioAllana);

    let texto: string = '';

    if (valorDespesa > this.saldoIndividualUsuarioLogado) {
      texto =
        'Esse valor ultrapassará o seu saldo disponível deixando seu saldo negativo. Deseja prossegui com o cadastro?';
    } else if (valorDespesa > this.saldoIndividualUsuarioOffline) {
      texto =
        'Esse valor ultrapassará o saldo disponível do seu parceiro deixando o saldo negativo. Deseja prossegui com o cadastro?';
    }

    if (texto === '') return true;

    return await this.emitirAlerta(event, texto);
  }

  // calcularSaldoConjunto(valorDespesa: number) {
  //   return 13250 - valorDespesa;
  // }

  // calcularSaldoIndividual(saldoConjunto: number, valorDespesaIndividual: number) {
  //   return saldoConjunto / 2 - valorDespesaIndividual;
  // }

  emitirAlerta(event: Event, texto: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        target: event.currentTarget as EventTarget,
        message: texto,
        icon: 'pi pi-info-circle',
        modal: true,
        position: 'center',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
        },
        accept: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Cadastro de despesa confirmado',
            life: 3000,
          });

          resolve(true);
        },
        reject: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'Cadastro de despesa cancelado',
            life: 3000,
          });

          resolve(false);
        },
      });
    });
  }
}
