import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

@Component({
  selector: 'app-department-new',
  templateUrl: './department-new.component.html'
})
export class DepartmentNewComponent {
  department: Department = {
    id: 0,
    name: ''
  };

  constructor(
    private departmentService: DepartmentService,
    public router: Router
  ) { }

  onSubmit(): void {
    this.departmentService.createDepartment(this.department).subscribe({
      next: () => {
        this.router.navigate(['/department']);
      },
      error: (error) => {
        console.error('Error al crear el departamento:', error);
      }
    });
  }
} 