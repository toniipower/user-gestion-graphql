import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.css']
})
export class DepartmentViewComponent implements OnInit {
  departments: Department[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los departamentos';
        console.error('Error loading departments:', error);
        this.isLoading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  addDepartment(): void {
    this.router.navigate(['/department/new']);
  }

  editDepartment(department: Department): void {
    this.router.navigate(['/department/edit', department.id]);
  }

  deleteDepartment(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(dept => dept.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el departamento';
          console.error('Error deleting department:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
