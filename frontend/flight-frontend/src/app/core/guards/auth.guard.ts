import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const role = authService.getUserRole(); // ✅ CORRECT SOURCE

  // 🔴 Not logged in
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // 🔐 Admin-only route
  if (state.url.includes('/add-flight') && role !== 'ROLE_ADMIN') {
    router.navigate(['/search-flights']);
    return false;
  }

  return true;
};
