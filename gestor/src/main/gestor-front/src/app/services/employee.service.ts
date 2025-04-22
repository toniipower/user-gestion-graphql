import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
  }

  getEmployeeById(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${employeeId}`);
  }
  
  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employee.id}`, employee);
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, employee);
  }
}
