import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TipoCategoriaUtilService {
  static formatar(label: string): string {
    const mapa: Record<string, string> = {
      Essencial: 'Essêncial',
      NaoEssencial: 'Não Essêncial',
      Investimento: 'Investimento',
      Emergencial: 'Emergencial',
    };

    return mapa[label] || label;
  }

  static normalizar(valor: any): string {
    return valor
      .replace(/\s/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  static capitalizar(valor: string): string {
    return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
  }

  static normalizarParaEnum(valor: string): string {
    return valor
      .normalize('NFD') // remove acento
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[\s-]+/) // separa palavras
      .map((p) => this.capitalizar(p)) // usa seu método aqui 👈
      .join('');
  }
}
