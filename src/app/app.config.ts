import Aura from '@primeuix/themes/aura';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  // providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideRouter(routes),
  ],
};
