import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './components/auth/login.component';
// import { RegisterComponent } from './components/auth/register.component';
// import { EmployeeViewComponent } from './components/employees/employee-view.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmployeeViewComponent } from './components/employee-view/employee-view.component';
import { DepartmentViewComponent } from './components/department-view/department-view.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeNewComponent } from './components/employee-new/employee-new.component';
import { DepartmentNewComponent } from './components/department-new/department-new.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'employees', 
    component: EmployeeViewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'department', 
    component: DepartmentViewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'department/new', 
    component: DepartmentNewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees/edit/:id', 
    component: EmployeeEditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/new', 
    component: EmployeeNewComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
