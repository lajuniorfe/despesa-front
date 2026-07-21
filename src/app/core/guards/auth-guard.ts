import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private msalService: MsalService,
  ) {}

  canActivate(): boolean {
    const account = this.msalService.instance.getActiveAccount();
    return true;
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
