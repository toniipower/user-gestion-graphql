import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard: Verificando autenticación');
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AuthGuard: isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('AuthGuard: No autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
    
    console.log('AuthGuard: Autenticado, permitiendo acceso');
    return true;
  }
}
