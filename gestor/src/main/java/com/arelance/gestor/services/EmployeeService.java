package com.arelance.gestor.services;

import java.util.List;
import java.util.Optional;

import com.arelance.gestor.exceptions.EmployeeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.repositories.EmployeeRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }


    @Transactional
    public Employee create(Employee employee) {

        // Comprobar si el email y el dni ya existen
        // Si existen, lanzar una excepción
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (employeeRepository.existsByDni(employee.getDni())) {
            throw new IllegalArgumentException("DNI already registered");
        }
        return employeeRepository.save(employee);
    }

    public void delete(Long id) {
        // Comprobar si existe el empleado con el id
        // Si no existe, lanzar una excepción personalizada
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.deleteById(id);
    }


    public Optional<Employee> findById(Long id) { //Optional<Employee> => para avisar de que puede ser nulo o no encontrar nada
        return Optional.ofNullable(employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id))); // usando la excepcion personalizada
    }


    @Transactional
    public Employee update(Employee employeeDetails, Long id) {
        // Buscar el empleado y lanzar excepción si no existe
        Employee employee = findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));

        // Verificar email único (si ha cambiado)
        if (!employee.getEmail().equals(employeeDetails.getEmail()) &&
            employeeRepository.existsByEmail(employeeDetails.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Verificar DNI único (si ha cambiado)
        if (!employee.getDni().equals(employeeDetails.getDni()) &&
            employeeRepository.existsByDni(employeeDetails.getDni())) {
            throw new IllegalArgumentException("DNI already registered");
        }

        // Actualizar propiedades básicas
        employee.setName(employeeDetails.getName());
        employee.setLastname(employeeDetails.getLastname());
        employee.setDni(employeeDetails.getDni());
        employee.setEmail(employeeDetails.getEmail());
        employee.setAddress(employeeDetails.getAddress());
        employee.setRole(employeeDetails.getRole());

        // Actualizar departamentos (primero limpiar para evitar problemas)
        employee.getDepartments().clear();
        if (employeeDetails.getDepartments() != null) {
            employee.getDepartments().addAll(employeeDetails.getDepartments());
        }

        // Guardar y devolver el empleado actualizado
        return employeeRepository.save(employee);
    }
}
