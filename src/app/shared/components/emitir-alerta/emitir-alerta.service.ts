import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private confirmationService = inject(ConfirmationService);

  confirmar(
    event: Event,
    message: string,
    header = 'Confirmação',
    acceptLabel = 'Sim',
    rejectLabel = 'Não',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        target: event.currentTarget as EventTarget,
        message,
        header,
        icon: 'pi pi-question-circle',
        modal: true,
        position: 'center',

        acceptLabel,
        rejectLabel,

        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
}
