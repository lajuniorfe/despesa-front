import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/pages/home/home.component';
import { PrivateLayoutComponent } from './layout/private/private-layout';
import { PublicLayoutComponent } from './layout/public/public-layout';
import { LoginComponent } from './features/login/pages/login/login.component';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: PublicLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },

  {
    path: '',
    component: PrivateLayoutComponent,
    children: [{ path: '', component: HomeComponent, canActivate: [AuthGuard] }],
  },
];
