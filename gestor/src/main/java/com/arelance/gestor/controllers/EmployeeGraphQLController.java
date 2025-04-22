package com.arelance.gestor.controllers;

import com.arelance.gestor.dto.EmployeeInput;
import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class EmployeeGraphQLController {

    @Autowired
    private EmployeeService employeeService;

    @QueryMapping
    public List<Employee> employees() {
        return employeeService.getAll();
    }

    @QueryMapping
    public Employee employee(@Argument Long id) {
        return employeeService.findById(id).orElse(null);
    }

    @MutationMapping
    public Employee createEmployee(@Argument("employee") EmployeeInput input) {
        Employee employee = new Employee();
        employee.setName(input.getName());
        employee.setLastname(input.getLastname());
        employee.setDni(input.getDni());
        employee.setEmail(input.getEmail());
        // Aquí deberías manejar el password y las relaciones con role y department
        return employeeService.create(employee);
    }

    @MutationMapping
    public Employee updateEmployee(@Argument Long id, @Argument("employee") EmployeeInput input) {
        Employee employee = new Employee();
        employee.setName(input.getName());
        employee.setLastname(input.getLastname());
        employee.setDni(input.getDni());
        employee.setEmail(input.getEmail());
        // Aquí deberías manejar el password y las relaciones con role y department
        return employeeService.update(employee, id);
    }

    @MutationMapping
    public Boolean deleteEmployee(@Argument Long id) {
        employeeService.delete(id);
        return true;
    }
} 