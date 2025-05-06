import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($department: DepartmentInput!) {
    createDepartment(department: $department) {
      id
      name
    }
  }
`;

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
    private apollo: Apollo,
    public router: Router
  ) { }

  onSubmit(): void {
    this.apollo.mutate<{ createDepartment: Department }>({
      mutation: CREATE_DEPARTMENT,
      variables: {
        department: {
          name: this.department.name
        }
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['/departments']);
      },
      error: (error) => {
        console.error('Error al crear el departamento:', error);
      }
    });
  }
} 