import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // --------------------------------------------------------------------
    // Esse observable informa quando a MSAL terminou qualquer interação.
    //
    // Exemplos:
    // - loginRedirect()
    // - acquireTokenRedirect()
    // - logoutRedirect()
    //
    // Enquanto houver alguma operação acontecendo,
    // o status será diferente de NONE.
    //
    // Quando chegar em NONE significa:
    //
    // "A MSAL terminou tudo o que precisava fazer."
    //
    // Só nesse momento é seguro consultar a conta ativa.
    // --------------------------------------------------------------------
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None,
        ),
        takeUntil(this._destroying$),
      )
      .subscribe(() => {
        // Verifica se já existe uma conta logada
        // e define uma conta ativa caso necessário.
        this.checkAndSetActiveAccount();
      });

    // --------------------------------------------------------------------
    // Escuta todos os eventos publicados pela MSAL.
    //
    // Aqui estamos interessados apenas no LOGIN_SUCCESS.
    // --------------------------------------------------------------------
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS,
        ),
        takeUntil(this._destroying$),
      )
      .subscribe((result: EventMessage) => {
        // O payload contém o resultado do login.
        const payload = result.payload as AuthenticationResult;

        // Define o usuário recém autenticado
        // como conta ativa da aplicação.
        //
        // Essa conta será usada depois pelo
        // acquireTokenSilent().
        this.authService.instance.setActiveAccount(payload.account);
      });
  }

  checkAndSetActiveAccount(): void {
    // Obtém a conta ativa.
    const activeAccount = this.authService.instance.getActiveAccount();

    // Se ainda não existir uma conta ativa...
    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      // Recupera todas as contas armazenadas
      // no cache da MSAL.
      const accounts = this.authService.instance.getAllAccounts();

      // Define a primeira como ativa.
      // Isso normalmente acontece quando
      // a aplicação é recarregada (F5).
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
