import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { gestorGuard } from './core/guards/gestor.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'vehicles/nuevo',
    loadComponent: () =>
      import('./pages/vehicles/vehicle-form.component').then((m) => m.VehicleFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'vehicles/:id',
    loadComponent: () =>
      import('./pages/vehicle-detail/vehicle-detail.component').then((m) => m.VehicleDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'gestor',
    loadComponent: () => import('./pages/gestor/gestor.component').then((m) => m.GestorComponent),
    canActivate: [gestorGuard],
  },
  { path: '**', redirectTo: '' },
];
