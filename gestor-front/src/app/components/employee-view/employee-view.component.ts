import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Employee } from '../../models/employee';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit, AfterViewInit {
  employees: Employee[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    // Inicializar todos los tooltips usando la versión global de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los empleados';
        console.error('Error loading employees:', error);
        this.isLoading = false;
        Swal.fire('Error', 'Error loading employees', 'error');
      }
    });
  }

  isAdmin(): boolean {
    const currentUserEmail = localStorage.getItem('email');
    const currentEmployee = this.employees.find(emp => emp.email === currentUserEmail);
    return currentEmployee?.role.erole === 'ADMIN';
  }

  addEmployee() {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employees/edit', employee.id]);
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.isLoading = false;
            Swal.fire('Eliminado', 'El empleado ha sido eliminado', 'success');
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar el empleado';
            console.error('Error deleting employee:', error);
            this.isLoading = false;
            Swal.fire('Error', 'Error deleting employee', 'error');
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
