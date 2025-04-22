package com.arelance.gestor.controllers;

import com.arelance.gestor.dto.DepartmentInput;
import com.arelance.gestor.entities.Department;
import com.arelance.gestor.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Controller
public class DepartmentGraphQLController {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentGraphQLController.class);

    @Autowired
    private DepartmentService departmentService;

    @QueryMapping
    public List<Department> departments() {
        return departmentService.getAll();
    }

    @QueryMapping
    public Department department(@Argument Long id) {
        return departmentService.findById(id);
    }

    @MutationMapping
    public Department createDepartment(@Argument("department") DepartmentInput input) {
        Department department = new Department();
        department.setName(input.getName());
        return departmentService.create(department);
    }

    @MutationMapping
    public Department updateDepartment(@Argument Long id, @Argument("department") DepartmentInput input) {
        try {
            logger.info("Intentando actualizar departamento con id: {} y nombre: {}", id, input.getName());
            
            // Primero obtenemos el departamento existente
            Department existingDepartment = departmentService.findById(id);
            if (existingDepartment == null) {
                logger.error("No se encontró el departamento con id: {}", id);
                throw new RuntimeException("Departamento no encontrado");
            }

            // Actualizamos solo los campos necesarios
            existingDepartment.setName(input.getName());
            
            // Guardamos los cambios
            Department updatedDepartment = departmentService.update(existingDepartment, id);
            logger.info("Departamento actualizado exitosamente: {}", updatedDepartment);
            
            return updatedDepartment;
        } catch (Exception e) {
            logger.error("Error al actualizar departamento: ", e);
            throw new RuntimeException("Error al actualizar el departamento: " + e.getMessage());
        }
    }

    @MutationMapping
    public Boolean deleteDepartment(@Argument Long id) {
        departmentService.delete(id);
        return true;
    }
} 