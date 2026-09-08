import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const gestorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.currentUser()?.role;
  if (auth.isLoggedIn() && (role === 'gestor' || role === 'admin')) return true;
  router.navigate(['/dashboard']);
  return false;
};
