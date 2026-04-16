import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private info: any;

  setInfo(valor: any) {
    this.info = valor;
  }

  getInfo() {
    return this.info;
  }

  clearInfo() {
    this.info = null;
  }
}
