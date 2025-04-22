package com.arelance.gestor.services;

import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.entities.Role;
import com.arelance.gestor.repositories.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {
    
    @Mock
    private EmployeeRepository employeeRepository;
    
    @InjectMocks
    private EmployeeService employeeService;
    
    @Test
    void testCreateEmployee() {
        // Arrange
        Employee employee = new Employee();
        employee.setName("Alvaro");
        employee.setLastname("Mero");
        employee.setDni("12345678A");
        employee.setEmail("Alvaro@mero.com");
        employee.setPassword("123456");
        
        when(employeeRepository.existsByEmail("Alvaro@mero.com")).thenReturn(false);
        when(employeeRepository.existsByDni("12345678A")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);
        
        // Act
        Employee created = employeeService.create(employee);
        
        // Assert
        assertNotNull(created);
        assertEquals("Alvaro", created.getName());
        assertEquals("Mero", created.getLastname());
        assertEquals("12345678A", created.getDni());
        assertEquals("Alvaro@mero.com", created.getEmail());
    }
    
    @Test
    void testCreateEmployeeWithExistingEmail() {
        // Arrange
        Employee employee = new Employee();
        employee.setEmail("Alvaro@mero.com");
        
        when(employeeRepository.existsByEmail("Alvaro@mero.com")).thenReturn(true);
        
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.create(employee);
        });
    }
    
    @Test
    void testCreateEmployeeWithExistingDni() {
        // Arrange
        Employee employee = new Employee();
        employee.setDni("12345678A");
        
        when(employeeRepository.existsByEmail(any())).thenReturn(false);
        when(employeeRepository.existsByDni("12345678A")).thenReturn(true);
        
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.create(employee);
        });
    }

    @Test
    void testUpdateEmployeeById() {
        // Arrange
        Long employeeId = 1L;
        Employee existingEmployee = new Employee();
        existingEmployee.setId(employeeId);
        existingEmployee.setName("Alvaro");
        existingEmployee.setLastname("Mero");
        existingEmployee.setDni("12345678A");
        existingEmployee.setEmail("alvaro@mero.com");
        existingEmployee.setPassword("123456");

        Employee updatedEmployee = new Employee();
        updatedEmployee.setName("Alvaro Updated");
        updatedEmployee.setLastname("Mero Updated");
        updatedEmployee.setEmail("alvaro.updated@mero.com");

        when(employeeRepository.findById(employeeId)).thenReturn(java.util.Optional.of(existingEmployee));
        when(employeeRepository.existsByEmail("alvaro.updated@mero.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(updatedEmployee);

        // Act
        Employee result = employeeService.update(updatedEmployee, employeeId);

        // Assert
        assertNotNull(result);
        assertEquals("Alvaro Updated", result.getName());
        assertEquals("Mero Updated", result.getLastname());
        assertEquals("alvaro.updated@mero.com", result.getEmail());
    }


    @Test
    void testDeleteEmployeeById() {
        // Arrange
        Long employeeId = 1L;
        Employee existingEmployee = new Employee();
        existingEmployee.setId(employeeId);
        existingEmployee.setName("Alvaro");
        existingEmployee.setEmail("alvaro@mero.com");

        // Configurar el mock para indicar que el empleado existe
        when(employeeRepository.existsById(employeeId)).thenReturn(true);

        // Act
        employeeService.delete(employeeId);

        // Assert
        // Verificar que el método delete del repositorio fue llamado
        verify(employeeRepository).deleteById(employeeId);
    }



} 