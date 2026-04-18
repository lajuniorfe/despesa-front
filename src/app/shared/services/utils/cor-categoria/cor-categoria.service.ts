import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CorCategoriaService {
  cores = [
    '--p-emerald-600',
    '--p-red-500',
    '--p-blue-700',
    '--p-green-300',
    '--p-yellow-500',
    '--p-purple-500',
    '--p-pink-500',
    '--p-indigo-500',
    '--p-orange-500',
    '--p-teal-700',
    '--p-sky-200',
    '--p-violet-500',
    '--p-rose-200',
    '--p-fuchsia-900',
    '--p-cyan-400',
    '--p-lime-600',
    '--p-amber-500',
    '--p-gray-700',
    '--p-stone-400',
    '--p-zinc-300',
    '--p-neutral-500',
  ];

  private mapa = new Map<string, string>();
  private indiceAtual = 0;

  getCorPorNome(nome: string): string {
    if (!this.mapa.has(nome)) {
      const cor = this.cores[this.indiceAtual % this.cores.length];
      this.mapa.set(nome, cor);
      this.indiceAtual++;
    }
    return this.mapa.get(nome)!;
  }

  getCorCss(nome: string): string {
    return this.getCorPorNome(nome);
  }

  getClasse(nome: string): string {
    return this.getCorPorNome(nome).replace('--p-', 'bg-');
  }
}
