import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, catchError } from 'rxjs';
import { Employee } from '../models/employee';
import { gql } from 'apollo-angular';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      lastname
      dni
      email
      role {
        id
        erole
      }
      department {
        id
        name
      }
    }
  }
`;

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      lastname
      dni
      email
      role {
        id
        erole
      }
      department {
        id
        name
      }
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($employee: EmployeeInput!) {
    createEmployee(employee: $employee) {
      id
      name
      lastname
      dni
      email
      role {
        id
        erole
      }
      department {
        id
        name
      }
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $employee: EmployeeInput!) {
    updateEmployee(id: $id, employee: $employee) {
      id
      name
      lastname
      email
      role {
        id
        erole
      }
      department {
        id
        name
      }
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees(): Observable<Employee[]> {
    console.log('EmployeeService: Obteniendo empleados');
    console.log('EmployeeService: Token actual:', localStorage.getItem('token'));
    
    return this.apollo
      .watchQuery<{ employees: Employee[] }>({
        query: GET_EMPLOYEES,
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      })
      .valueChanges.pipe(
        map(result => {
          console.log('EmployeeService: Respuesta completa:', result);
          if (!result.data || !result.data.employees) {
            throw new Error('La respuesta no tiene la estructura esperada');
          }
          return result.data.employees;
        }),
        catchError(error => {
          console.error('EmployeeService: Error al obtener empleados:', error);
          console.error('EmployeeService: Detalles del error:', {
            message: error.message,
            networkError: error.networkError,
            graphQLErrors: error.graphQLErrors
          });
          throw error;
        })
      );
  }

  getEmployee(id: number): Observable<Employee> {
    return this.apollo.query<{ employee: Employee }>({
      query: GET_EMPLOYEE,
      variables: { id }
    }).pipe(
      map(result => result.data.employee),
      catchError(error => {
        console.error('Error getting employee:', error);
        throw error;
      })
    );
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.apollo.mutate<{ createEmployee: Employee }>({
      mutation: CREATE_EMPLOYEE,
      variables: { employee }
    }).pipe(
      map(result => result.data!.createEmployee),
      catchError(error => {
        console.error('Error creating employee:', error);
        throw error;
      })
    );
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, employee }
    }).pipe(
      map(result => result.data!.updateEmployee),
      catchError(error => {
        console.error('Error updating employee:', error);
        throw error;
      })
    );
  }

  deleteEmployee(id: number): Observable<boolean> {
    return this.apollo.mutate<{ deleteEmployee: boolean }>({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    }).pipe(
      map(result => result.data!.deleteEmployee),
      catchError(error => {
        console.error('Error deleting employee:', error);
        throw error;
      })
    );
  }
}
