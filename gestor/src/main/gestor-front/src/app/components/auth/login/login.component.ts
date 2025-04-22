import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/employees']);
    }
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      console.log('Intentando login con:', { email }); // Para debugging
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response); // Para debugging
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error en login:', error); // Para debugging
          this.isLoading = false;
          this.showError(error.message);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.showValidationErrors();
    }
  }

  private showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }

  private showValidationErrors() {
    const errors = [];
    
    if (this.emailControl?.errors?.['required']) {
      errors.push('El email es requerido');
    }
    if (this.emailControl?.errors?.['email']) {
      errors.push('El email no es válido');
    }
    if (this.passwordControl?.errors?.['required']) {
      errors.push('La contraseña es requerida');
    }
    if (this.passwordControl?.errors?.['minlength']) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos inválidos',
        html: errors.join('<br>'),
        confirmButtonColor: '#3085d6'
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

