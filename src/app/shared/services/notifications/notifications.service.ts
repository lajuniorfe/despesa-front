import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';
import { NotificationMessage } from '../utils/notification-messagem/notification-mensagem';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private caminho = environment.serverUrl + 'Notifications';

  private eventSource?: EventSource;

  private notificationsSubject = new Subject<NotificationMessage>();

  notifications$ = this.notificationsSubject.asObservable();

  connect() {
    console.log('tentando conectar SSE');

    this.eventSource = new EventSource(`${this.caminho}/stream`);

    this.eventSource.onopen = () => {
      console.log('SSE conectado');
    };

    this.eventSource.onmessage = (event) => {
      console.log('chegou algo', event.data);

      const notification: NotificationMessage = JSON.parse(event.data);

      this.notificationsSubject.next(notification);
    };

    this.eventSource.onerror = (error) => {
      console.error('Erro SSE', error);
    };
  }
}
