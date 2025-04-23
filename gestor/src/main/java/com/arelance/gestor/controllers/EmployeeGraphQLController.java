package com.arelance.gestor.controllers;

import com.arelance.gestor.dto.EmployeeInput;
import com.arelance.gestor.entities.Department;
import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.entities.Role;
import com.arelance.gestor.repositories.DepartmentRepository;
import com.arelance.gestor.repositories.RoleRepository;
import com.arelance.gestor.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class EmployeeGraphQLController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;

    public EmployeeGraphQLController(RoleRepository roleRepository, DepartmentRepository departmentRepository) {
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;

    }

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
        // employee.setPassword(input.getPassword());
        String encryptedPassword = passwordEncoder.encode(input.getPassword());
        employee.setPassword(encryptedPassword);
        // Aquí deberías manejar el password y las relaciones con role y department
        Role role = roleRepository.findById(input.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role no encontrado"));
        employee.setRole(role);

        if (input.getDepartmentId() != null) {
            Department department = departmentRepository.findById(input.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
            
            // Creamos un Set con el único departamento y lo asignamos
            Set<Department> departments = new HashSet<>();
            departments.add(department);
            employee.setDepartments(departments);
        }

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