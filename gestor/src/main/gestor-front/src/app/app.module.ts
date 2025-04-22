import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeViewComponent } from './components/employee-view/employee-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DepartmentViewComponent } from './components/department-view/department-view.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeNewComponent } from './components/employee-new/employee-new.component';
import { DepartmentNewComponent } from './components/department-new/department-new.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeViewComponent,
    DepartmentViewComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    EmployeeEditComponent,
    EmployeeNewComponent,
    DepartmentNewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
