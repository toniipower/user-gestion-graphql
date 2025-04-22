import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-new',
  templateUrl: './employee-new.component.html',
  styleUrls: ['./employee-new.component.css']
})
export class EmployeeNewComponent implements OnInit {
  employeeForm: FormGroup;
  departments: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', Validators.required],
      address: [''],
      department: [null]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        Swal.fire(
          'Error',
          'No se pudieron cargar los departamentos',
          'error'
        );
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const formData = this.employeeForm.value;
      
      // Crear el objeto de empleado con los datos del formulario
      const employeeData = {
        name: formData.name,
        lastname: formData.lastname || '',
        email: formData.email,
        password: formData.password,
        dni: formData.dni,
        address: formData.address || '',
        role: {
          id: 2,
          erole: null
        },
        departments: []
      };

      console.log('Datos a enviar:', employeeData); // Para debugging

      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire(
            '¡Éxito!',
            'Empleado creado correctamente',
            'success'
          ).then(() => {
            this.router.navigate(['/employees']);
          });
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.isLoading = false;
          
          let errorMessage = 'Error al crear el empleado';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          Swal.fire(
            'Error',
            errorMessage,
            'error'
          );
        }
      });
    } else {
      this.markFormGroupTouched(this.employeeForm);
      this.showValidationErrors();
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

  private showValidationErrors() {
    const errors = [];
    
    if (this.employeeForm.get('name')?.errors?.['required']) {
      errors.push('El nombre es requerido');
    }
    if (this.employeeForm.get('email')?.errors?.['required']) {
      errors.push('El email es requerido');
    }
    if (this.employeeForm.get('email')?.errors?.['email']) {
      errors.push('El email no es válido');
    }
    if (this.employeeForm.get('password')?.errors?.['required']) {
      errors.push('La contraseña es requerida');
    }
    if (this.employeeForm.get('password')?.errors?.['minlength']) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (this.employeeForm.get('dni')?.errors?.['required']) {
      errors.push('El DNI es requerido');
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

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
} 