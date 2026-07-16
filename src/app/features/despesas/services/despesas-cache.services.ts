import { Injectable } from '@angular/core';
import { DespesaRelacionamentoResponse } from '../models/retorno-despesa.model';

interface CacheItem {
  data: DespesaRelacionamentoResponse[];
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class DespesaCacheService {
  private readonly TTL = 10 * 60 * 1000; // 5 minutos

  private cache = new Map<string, CacheItem>();

  private getKey(ano: number, mes: number): string {
    return `${ano}-${mes}`;
  }

  get(ano: number, mes: number): DespesaRelacionamentoResponse[] | null {
    const key = this.getKey(ano, mes);
    const item = this.cache.get(key);

    if (!item) return null;

    const expirou = Date.now() - item.createdAt > this.TTL;

    if (expirou) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(
    ano: number,
    mes: number,
    despesas: DespesaRelacionamentoResponse[],
  ): void {
    this.cache.set(this.getKey(ano, mes), {
      data: despesas,
      createdAt: Date.now(),
    });
  }

  remove(ano: number, mes: number): void {
    this.cache.delete(this.getKey(ano, mes));
  }

  clear(): void {
    this.cache.clear();
  }

  add(ano: number, mes: number, despesa: DespesaRelacionamentoResponse): void {
    const key = this.getKey(ano, mes);
    const item = this.cache.get(key);

    if (!item) {
      this.cache.set(key, {
        data: [despesa],
        createdAt: Date.now(),
      });

      return;
    }
    item.data.push(despesa);
  }

  update(
    ano: number,
    mes: number,
    despesaAtualizada: DespesaRelacionamentoResponse,
  ): void {
    const key = this.getKey(ano, mes);

    const cacheItem = this.cache.get(key);

    if (!cacheItem) {
      return;
    }

    const index = cacheItem.data.findIndex(
      (x) => x.id === despesaAtualizada.id,
    );

    if (index !== -1) {
      cacheItem.data[index] = despesaAtualizada;
    }
  }
}
