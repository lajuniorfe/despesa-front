import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  canActivate(): boolean {
    let account = this.msalService.instance.getActiveAccount();

    if (!account) {
      const accounts = this.msalService.instance.getAllAccounts();

      if (accounts.length > 0) {
        account = accounts[0];

        this.msalService.instance.setActiveAccount(account);
      }
    }

    if (account) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const exp = payload.exp;
      const agora = Math.floor(Date.now() / 1000);

      return exp < agora;
    } catch (e) {
      return true;
    }
  }
}
