import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId!: number;
  departments: Department[] = [];
  roles = [
    { id: 1, erole: 'ADMIN' },
    { id: 2, erole: 'CONSULTANT' }
  ];
  isLoading: boolean = false;

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', Validators.required],
      role: [null],
      department: [null]
    });
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployee();
    this.loadDepartments();
  }

  loadEmployee(): void {
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          lastname: employee.lastname,
          email: employee.email,
          dni: employee.dni,
          role: employee.role,
          department: employee.department
        });
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        Swal.fire('Error', 'Error loading employee', 'error');
      }
    });
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
      const employeeData: Employee = {
        id: this.employeeId,
        name: formValue.name,
        lastname: formValue.lastname,
        email: formValue.email,
        dni: formValue.dni,
        role: formValue.role,
        department: formValue.department
      };

      this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Employee updated successfully', 'success');
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating employee:', error);
          Swal.fire('Error', 'Error updating employee', 'error');
        }
      });
    }
  }
} 