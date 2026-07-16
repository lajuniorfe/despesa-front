import { Injectable } from '@angular/core';
import { CartaoResponse } from '../models/cartao-response.model';

@Injectable({
  providedIn: 'root',
})
export class CartaoCacheService {
  private cache: CartaoResponse[] | null = null;

  get(): CartaoResponse[] | null {
    return this.cache;
  }

  set(cartoes: CartaoResponse[]): void {
    this.cache = cartoes;
  }

  update(cartaoAtualizado: CartaoResponse): void {
    if (!this.cache) {
      return;
    }

    const index = this.cache.findIndex((x) => x.id === cartaoAtualizado.id);

    if (index !== -1) {
      this.cache[index] = cartaoAtualizado;
    }
  }

  add(cartao: CartaoResponse): void {
    if (!this.cache) {
      this.cache = [cartao];
      return;
    }

    this.cache.push(cartao);
  }

  remove(id: number): void {
    if (!this.cache) {
      return;
    }

    this.cache = this.cache.filter((x) => x.id !== id);
  }

  clear(): void {
    this.cache = null;
  }
}
