import { Component } from '@angular/core';
import { Principal } from '../../components/principal/principal';
import { ExibirDespesasComponent } from '../../components/exibir-despesas/exibir-despesas.component';
import { ExibirCartoes } from '../../components/exibir-cartoes/exibir-cartoes';

@Component({
  selector: 'app-home',
  imports: [Principal, ExibirDespesasComponent, ExibirCartoes],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class HomeComponent {}
