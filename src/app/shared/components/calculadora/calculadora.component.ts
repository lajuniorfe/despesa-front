import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-calculadora',
  imports: [Dialog],
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.css',
})
export class CalculadoraComponent {
  @Input() valorFormulario: number | null = null;
  @Output() valorCalculado = new EventEmitter<number>();
  calculadoraVisivel = false;
  displayCalculadora = '0';
  private valorAnterior: number | null = null;
  private operador: string | null = null;
  private aguardandoNovoNumero = false;

  abrir(): void {
    if (this.valorFormulario !== null && this.valorFormulario !== undefined) {
      this.displayCalculadora = this.valorFormulario
        .toFixed(2)
        .replace('.', ',');
    } else {
      this.displayCalculadora = '0';
    }

    this.valorAnterior = null;
    this.operador = null;
    this.aguardandoNovoNumero = false;

    this.calculadoraVisivel = true;
  }

  digitarCalculadora(valor: string): void {
    if (this.aguardandoNovoNumero) {
      this.displayCalculadora = valor === ',' ? '0,' : valor;

      this.aguardandoNovoNumero = false;

      return;
    }

    if (valor === ',' && this.displayCalculadora.includes(',')) {
      return;
    }

    if (this.displayCalculadora.includes(',')) {
      const casasDecimais = this.displayCalculadora.split(',')[1];

      if (casasDecimais.length >= 2) {
        return;
      }
    }

    if (this.displayCalculadora === '0' && valor !== ',') {
      this.displayCalculadora = valor;
    } else {
      this.displayCalculadora += valor;
    }
  }

  selecionarOperador(operador: string): void {
    const valor = Number(this.displayCalculadora.replace(',', '.'));

    if (this.valorAnterior !== null && this.operador) {
      const resultado = this.executarOperacao(
        this.valorAnterior,
        valor,
        this.operador,
      );

      this.displayCalculadora = resultado.toFixed(2).replace('.', ',');

      this.valorAnterior = resultado;
    } else {
      this.valorAnterior = valor;
    }

    this.operador = operador;
    this.aguardandoNovoNumero = true;
  }

  finalizarCalculadora(): void {
    if (this.valorAnterior !== null && this.operador !== null) {
      const valorAtual = Number(this.displayCalculadora.replace(',', '.'));

      const resultado = this.executarOperacao(
        this.valorAnterior,
        valorAtual,
        this.operador,
      );

      this.displayCalculadora = resultado.toFixed(2).replace('.', ',');
    }

    const resultadoFinal = Number(this.displayCalculadora.replace(',', '.'));

    // 🔥 Envia para o componente pai
    this.valorCalculado.emit(resultadoFinal);

    this.calculadoraVisivel = false;

    this.valorAnterior = null;
    this.operador = null;
    this.aguardandoNovoNumero = false;
  }

  limparCalculadora(): void {
    this.displayCalculadora = '0';

    this.valorAnterior = null;
    this.operador = null;
    this.aguardandoNovoNumero = false;
  }

  private executarOperacao(
    primeiro: number,
    segundo: number,
    operador: string,
  ): number {
    switch (operador) {
      case '+':
        return primeiro + segundo;

      case '-':
        return primeiro - segundo;

      case '*':
        return primeiro * segundo;

      case '/':
        return segundo === 0 ? 0 : primeiro / segundo;

      default:
        return segundo;
    }
  }
}
