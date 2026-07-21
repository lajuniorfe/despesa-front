import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl = environment.serverUrl;

  constructor(private msalService: MsalService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.apiUrl)) {
      return next.handle(req);
    }

    const account = this.msalService.instance.getActiveAccount();

    if (!account) {
      return next.handle(req);
    }

    return from(
      this.msalService.instance.acquireTokenSilent({
        account,
        scopes: [environment.apiScope],
      }),
    ).pipe(
      switchMap((result) => {
        const authRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        });

        return next.handle(authRequest);
      }),
    );
  }
}
