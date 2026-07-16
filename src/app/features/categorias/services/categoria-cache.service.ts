import { Injectable } from '@angular/core';
import { CategoriaResponse } from '../models/categoria-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaCacheService {
  private cache: CategoriaResponse[] | null = null;

  get(): CategoriaResponse[] | null {
    return this.cache;
  }

  set(categorias: CategoriaResponse[]): void {
    this.cache = categorias;
  }

  update(categoriaAtualizada: CategoriaResponse): void {
    if (!this.cache) {
      return;
    }

    const index = this.cache.findIndex((x) => x.id === categoriaAtualizada.id);

    if (index !== -1) {
      this.cache[index] = categoriaAtualizada;
    }
  }

  clear(): void {
    this.cache = null;
  }
}
