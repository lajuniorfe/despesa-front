import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { Tabs, TabList, TabsModule } from 'primeng/tabs';
import { DespesaResponse } from '../../../despesas/models/despesa-response.model';

@Component({
  selector: 'app-exibir-despesas',
  imports: [Tabs, TabList, TabsModule, TableModule, DataViewModule, ButtonModule],
  templateUrl: './exibir-despesas.component.html',
  styleUrl: './exibir-despesas.component.css',
})
export class ExibirDespesasComponent {
  @Input() listaDespesasRecebida: DespesaResponse[] = [];

  listaDespesaCasa = [
    { nome: 'Supermercado Guanabara', categoria: 'Casa', valor: 185.9, pagamento: 'Cartão Nubank' },
    { nome: 'Conta de Luz', categoria: 'Casa', valor: 120.45, pagamento: 'Débito automático' },
    { nome: 'Internet Fibra', categoria: 'Casa', valor: 99.9, pagamento: 'Cartão Inter' },
    { nome: 'Água', categoria: 'Casa', valor: 78.3, pagamento: 'Boleto' },
    { nome: 'Compra Mercado Extra', categoria: 'Casa', valor: 210.75, pagamento: 'Cartão Itaú' },
    { nome: 'Gás de cozinha', categoria: 'Casa', valor: 110.0, pagamento: 'Pix' },
    { nome: 'Produtos de limpeza', categoria: 'Casa', valor: 65.2, pagamento: 'Cartão Nubank' },
    { nome: 'Padaria', categoria: 'Casa', valor: 32.5, pagamento: 'Dinheiro' },
    { nome: 'Manutenção elétrica', categoria: 'Casa', valor: 150.0, pagamento: 'Pix' },
    { nome: 'Compra 1', categoria: 'Casa', valor: 30.0, pagamento: 'Cartão X' },
  ];

  listaDespesaIndividual = [
    {
      nome: 'Almoço no restaurante',
      categoria: 'Alimentação',
      valor: 42.5,
      pagamento: 'Cartão Nubank',
    },
    { nome: 'Uber', categoria: 'Transporte', valor: 18.9, pagamento: 'Cartão Inter' },
    { nome: 'Netflix', categoria: 'Entretenimento', valor: 39.9, pagamento: 'Cartão de crédito' },
    { nome: 'Academia', categoria: 'Saúde', valor: 89.9, pagamento: 'Débito automático' },
    { nome: 'Café', categoria: 'Alimentação', valor: 9.5, pagamento: 'Pix' },
    { nome: 'Compra de roupa', categoria: 'Vestuário', valor: 120.0, pagamento: 'Cartão Itaú' },
    { nome: 'Cinema', categoria: 'Entretenimento', valor: 35.0, pagamento: 'Cartão Nubank' },
    { nome: 'iFood', categoria: 'Alimentação', valor: 55.7, pagamento: 'Cartão Inter' },
    { nome: 'Farmácia', categoria: 'Saúde', valor: 27.3, pagamento: 'Dinheiro' },
    { nome: 'Compra 1', categoria: 'Casa', valor: 30.0, pagamento: 'Cartão X' },
  ];

  listaDespesaFatura = [
    { nome: 'Padaria', categoria: 'Casa', valor: 32.5, pagamento: 'Dinheiro' },
    { nome: 'Manutenção elétrica', categoria: 'Casa', valor: 150.0, pagamento: 'Pix' },
    { nome: 'Compra 1', categoria: 'Casa', valor: 30.0, pagamento: 'Cartão X' },
  ];

  tabSelecionada = 'individual';
}
