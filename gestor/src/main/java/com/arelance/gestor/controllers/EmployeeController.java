package com.arelance.gestor.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.services.EmployeeService;

import org.springframework.web.bind.annotation.GetMapping;

import javax.validation.Valid;

@RestController
@RequestMapping("api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping("")
    public List<Employee> getAll(){
        return employeeService.getAll();
    }

    @PostMapping
    public Employee create(@RequestBody @Valid Employee employee){
        return employeeService.create(employee);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        employeeService.delete(id);
    }

    @GetMapping("/{id}")
    public Employee findById(@PathVariable Long id){
        return employeeService.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Employee update(@RequestBody @Valid Employee employeeDetails, @PathVariable Long id){
        return employeeService.update(employeeDetails, id);
    }




}
