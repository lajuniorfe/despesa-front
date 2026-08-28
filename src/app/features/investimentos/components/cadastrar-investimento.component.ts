import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../../shared/services/token/token.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { InvestimentoRequest } from '../../relatorios/models/investimento-request.model';
import { InvestimentoService } from '../../relatorios/services/investimento.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cadastrar-investimento',
  imports: [
    Card,
    InputNumber,
    DatePicker,
    Select,
    Button,
    Toast,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './cadastrar-investimento.component.html',
  styleUrl: './cadastrar-investimento.component.css',
})
export class CadastrarInvestimentoComponent {
  request = new InvestimentoRequest();
  formulario!: FormGroup;
  grupoTipoInvestimento = [
    { label: 'Reserva de Emergência', value: 0 },
    { label: 'Bolsa de valores', value: 1 },
    { label: 'Retirada', value: 2 },
    { label: 'Pagamento de dívida', value: 3 },
  ];

  constructor(
    private fb: FormBuilder,
    private readonly tokenService: TokenService,
    private loadingService: LoadingService,
    private readonly investimentoService: InvestimentoService,
  ) {}

  ngOnInit() {
    this.criarFormulario();
    this.configurarTipoInvestimento();
  }

  criarFormulario() {
    this.formulario = this.fb.group({
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      data: [new Date(), Validators.required],
      tipoInvestimento: ['', Validators.required],
      usuario: [null, Validators.required],
    });
  }

  cadastrarInvestimento(): void {
    this.montaRequest();

    this.investimentoService
      .cadastrarInvestimento(this.request)
      .subscribe(() => {
        // Atualiza cache/tela depois de cadastrar
      });
  }

  montaRequest() {
    this.request.tipo = this.formulario.value.tipoInvestimento;
    switch (this.request.tipo) {
      case 0:
        this.request.descricao = 'Reserva de Emergência';
        break;
      case 1:
        this.request.descricao = 'Bolsa de valores';
        break;
      case 2:
        this.request.descricao = this.formulario.value.descricao;
        break;
      case 3:
        this.request.descricao = this.formulario.value.descricao;
        break;
    }

    this.request.valor = this.formulario.value.valor;
    this.request.data = this.formulario.value.data;
    this.request.idusuario = 1;
  }

  fecharTela() {}

  private configurarTipoInvestimento(): void {
    this.formulario.get('tipoInvestimento')?.valueChanges.subscribe((valor) => {
      const descricao = this.formulario.get('descricao');

      if (valor === 0 || valor === 1) {
        descricao?.disable();
      } else {
        descricao?.enable();
      }
    });
  }
}
