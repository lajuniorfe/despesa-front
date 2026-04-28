import { Component } from '@angular/core';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-desejo',
  imports: [OrderListModule, TableModule],
  templateUrl: './desejo.component.html',
  styleUrl: './desejo.component.css',
})
export class DesejoComponent {
  produtos = [
    { id: 1, nome: 'Ofurô', usuario: 1, prioridade: 0, preco: 10 },
    { id: 2, nome: 'HNVe', usuario: 2, prioridade: 1, preco: 10 },
    { id: 3, nome: 'Roupa', usuario: 3, prioridade: 2, preco: 10 },
    { id: 4, nome: 'Carro', usuario: 1, prioridade: 3, preco: 10 },
    { id: 5, nome: 'Viajar', usuario: 2, prioridade: 0, preco: 10 },
    { id: 6, nome: 'Televisão', usuario: 3, prioridade: 1, preco: 10 },
  ];
  oldList: any[] = [];

  ngOnInit() {
    this.produtos.sort((a, b) => a.prioridade - b.prioridade);
    this.oldList = [...this.produtos];
  }
}
