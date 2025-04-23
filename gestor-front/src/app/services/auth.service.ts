import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  tipo: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar el estado de la autenticación al iniciar el servicio
    this.checkAuthState();
  }

  private checkAuthState(): void {
    console.log('checkAuthState: Verificando estado de autenticación');
    const token = this.getToken();
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    console.log('checkAuthState: Token:', token);
    console.log('checkAuthState: TokenExpiration:', tokenExpiration);
    
    if (token && tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration);
      console.log('checkAuthState: Tiempo actual:', Date.now());
      console.log('checkAuthState: Tiempo de expiración:', expirationTime);
      
      if (Date.now() > expirationTime) {
        console.log('checkAuthState: Token expirado, haciendo logout');
        this.logout();
        this.router.navigate(['/login']);
      } else {
        console.log('checkAuthState: Token válido');
      }
    } else {
      console.log('checkAuthState: No hay token o expiración, haciendo logout');
      this.logout();
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: LoginResponse) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.rol);
        localStorage.setItem('email', response.email);
        localStorage.setItem('tokenExpiration', (Date.now() + 3600000).toString()); // 1 hora de expiración
        
        this.router.navigate(['/employees']);
      }),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.status === 401) {
          if (error.error && error.error.message) {
            if (error.error.message.includes('Usuario no encontrado')) {
              errorMessage = 'El usuario no existe en la base de datos';
            } else if (error.error.message.includes('Contraseña incorrecta')) {
              errorMessage = 'La contraseña es incorrecta';
            }
          } else {
            errorMessage = 'Credenciales inválidas';
          }
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
        } else if (error.status === 500) {
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(name: string, lastname: string, dni: string, email: string, password: string, rol: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, lastname, dni, email, password, rol }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.rol);
        localStorage.setItem('email', response.email);
        localStorage.setItem('tokenExpiration', (Date.now() + 3600000).toString());
        this.router.navigate(['/employees']);
      })
    );
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  logout(): void {
    console.log('logout: Limpiando localStorage y redirigiendo a login');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    console.log('isAuthenticated: Verificando autenticación');
    const token = this.getToken();
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    console.log('isAuthenticated: Token:', token);
    console.log('isAuthenticated: TokenExpiration:', tokenExpiration);
    
    if (!token || !tokenExpiration) {
      console.log('isAuthenticated: No hay token o expiración');
      this.logout();
      this.router.navigate(['/login']);
      return false;
    }

    const expirationTime = parseInt(tokenExpiration);
    console.log('isAuthenticated: Tiempo actual:', Date.now());
    console.log('isAuthenticated: Tiempo de expiración:', expirationTime);
    
    if (Date.now() > expirationTime) {
      console.log('isAuthenticated: Token expirado');
      this.logout();
      this.router.navigate(['/login']);
      return false;
    }

    console.log('isAuthenticated: Token válido');
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
