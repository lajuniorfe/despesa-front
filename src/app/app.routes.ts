import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { HomeComponent } from './features/dashboard/pages/home/home.component';
import { DesejoComponent } from './features/desejos/components/desejo.component';
import { LoginComponent } from './features/login/pages/login/login.component';
import { PagamentoComponent } from './features/pagamentos/components/pagamento.component';
import { RelatorioDespesaComponent } from './features/relatorios/relatorio-despesa/relatorio-despesa.component';
import { PrivateLayoutComponent } from './layout/private/private-layout';
import { PublicLayoutComponent } from './layout/public/public-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: PublicLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },

  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: HomeComponent }],
  },

  {
    path: 'relatorios',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RelatorioDespesaComponent,
      },
    ],
  },

  {
    path: 'pagamentos',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: PagamentoComponent }],
  },

  {
    path: 'desejos',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DesejoComponent }],
  },
];
