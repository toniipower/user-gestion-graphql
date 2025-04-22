import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  name: string;
  lastname: string;
  email: string;
  dni: string;
  address: string;
  role: {
    erole: string;
  };
}

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

  loadEmployees() {
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
      }
    });
  }

  isAdmin(): boolean {
    // Buscar el empleado actual por email (asumiendo que el email del usuario logueado está en localStorage)
    const currentUserEmail = localStorage.getItem('email');
    const currentEmployee = this.employees.find(emp => emp.email === currentUserEmail);
    
    if (currentEmployee) {
      console.log('Rol del empleado actual:', currentEmployee.role.erole);
      return currentEmployee.role.erole === 'ADMIN';
    }
    
    return false;
  }

  addEmployee() {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employees/edit', employee.id]);
  }

  deleteEmployee(employeeId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.employeeService.deleteEmployee(employeeId).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== employeeId);
            this.isLoading = false;
            Swal.fire(
              '¡Eliminado!',
              'El empleado ha sido eliminado exitosamente.',
              'success'
            );
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar el empleado';
            console.error('Error deleting employee:', error);
            this.isLoading = false;
            Swal.fire(
              'Error',
              'No se pudo eliminar el empleado. Por favor, intente nuevamente.',
              'error'
            );
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
