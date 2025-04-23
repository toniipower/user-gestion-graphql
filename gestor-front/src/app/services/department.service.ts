import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Department } from '../models/employee';
import { gql } from 'apollo-angular';

const GET_DEPARTMENTS = gql`
  query {
    departments {
      id
      name
    }
  }
`;

const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    department(id: $id) {
      id
      name
    }
  }
`;

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($department: DepartmentInput!) {
    createDepartment(department: $department) {
      id
      name
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $department: DepartmentInput!) {
    updateDepartment(id: $id, department: $department) {
      id
      name
    }
  }
`;

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private apollo: Apollo) {}

  getDepartments(): Observable<Department[]> {
    return this.apollo
      .watchQuery<{ departments: Department[] }>({
        query: GET_DEPARTMENTS
      })
      .valueChanges.pipe(
        map(result => result.data.departments)
      );
  }

  getDepartment(id: number): Observable<Department> {
    return this.apollo
      .watchQuery<{ department: Department }>({
        query: GET_DEPARTMENT,
        variables: { id }
      })
      .valueChanges.pipe(
        map(result => result.data.department)
      );
  }

  createDepartment(department: Department): Observable<Department> {
    return this.apollo
      .mutate<{ createDepartment: Department }>({
        mutation: CREATE_DEPARTMENT,
        variables: {
          department: {
            name: department.name
          }
        }
      })
      .pipe(map(result => result.data!.createDepartment));
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.apollo
      .mutate<{ updateDepartment: Department }>({
        mutation: UPDATE_DEPARTMENT,
        variables: {
          id,
          department: {
            name: department.name
          }
        }
      })
      .pipe(map(result => result.data!.updateDepartment));
  }

  deleteDepartment(id: number): Observable<void> {
    return this.apollo
      .mutate<{ deleteDepartment: boolean }>({
        mutation: DELETE_DEPARTMENT,
        variables: { id }
      })
      .pipe(map(() => undefined));
  }
}
