package com.arelance.gestor.controllers;

import com.arelance.gestor.entities.Department;
import com.arelance.gestor.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/departments")
@CrossOrigin(origins = "http://localhost:4200")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("")
    public List<Department> getAll(){
        return departmentService.getAll();
    }

    @GetMapping("/{id}")
    public Department findById( @PathVariable  Long id){
        return departmentService.findById(id);
    }

    @PostMapping("")
    public  Department create(@RequestBody @Valid Department department){
        return departmentService.create(department);
    }

    @PutMapping("/{id}")
    public Department update(@RequestBody @Valid Department department, @PathVariable Long id){
        return departmentService.update(department, id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        departmentService.delete(id);
    }
}
