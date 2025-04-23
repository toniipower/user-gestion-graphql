import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { Employee } from '../../models/employee';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-new',
  templateUrl: './employee-new.component.html',
  styleUrls: ['./employee-new.component.css'],
  providers: [FormBuilder]
})
export class EmployeeNewComponent implements OnInit {
  employeeForm: FormGroup;
  departments: Department[] = [];
  isLoading: boolean = false;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
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
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const formValue = this.employeeForm.value;
      const employeeData: Omit<Employee, 'id'> = {
        name: formValue.name,
        lastname: formValue.lastname,
        email: formValue.email,
        dni: formValue.dni,
        role: { id: 2, erole: 'CONSULTANT' }, // Por defecto, nuevo empleado es CONSULTANT
        department: this.departments.find(d => d.id === formValue.department) || null
      };
      console.log('Formulario válido, enviando datos:', employeeData);

      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Employee created successfully', 'success');
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating employee:', error);
          Swal.fire('Error', 'Error creating employee', 'error');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
} 