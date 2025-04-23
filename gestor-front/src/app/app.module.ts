import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmployeeViewComponent } from './components/employee-view/employee-view.component';
import { DepartmentViewComponent } from './components/department-view/department-view.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeNewComponent } from './components/employee-new/employee-new.component';
import { DepartmentNewComponent } from './components/department-new/department-new.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ApolloModule } from 'apollo-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DepartmentViewComponent,
    EmployeeEditComponent,
    EmployeeNewComponent,
    EmployeeViewComponent,
    NavbarComponent,
    DepartmentNewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    GraphQLModule,
    ApolloModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
