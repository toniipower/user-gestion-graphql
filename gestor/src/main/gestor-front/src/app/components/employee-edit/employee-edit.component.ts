import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  departments: any[] = [];
  isLoading: boolean = false;
  employeeId: number = 0;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', Validators.required],
      address: [''],
      department: [null],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartments();
    this.loadEmployee();
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

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          lastname: employee.lastname,
          email: employee.email,
          dni: employee.dni,
          address: employee.address,
          department: employee.departmentId,
          role: employee.role
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.isLoading = false;
        Swal.fire(
          'Error',
          'No se pudo cargar la información del empleado',
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
        id: this.employeeId,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        dni: formData.dni,
        address: formData.address,
        departmentId: formData.department || null, // Si no hay departamento seleccionado, enviar null
        role: formData.role
      };

      this.employeeService.updateEmployee(employeeData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire(
            '¡Éxito!',
            'Empleado actualizado correctamente',
            'success'
          ).then(() => {
            this.router.navigate(['/employees']);
          });
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.errorMessage = 'Error al actualizar el empleado';
          this.isLoading = false;
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
    if (this.employeeForm.get('dni')?.errors?.['required']) {
      errors.push('El DNI es requerido');
    }
    if (this.employeeForm.get('role')?.errors?.['required']) {
      errors.push('El rol es requerido');
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
} 