package com.arelance.gestor.services;

import com.arelance.gestor.entities.Department;
import com.arelance.gestor.repositories.DepartmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)  // Habilita mockito para pruebas
public class DepartmentServiceTest {
    
    @Mock  // crea una version simulada de DepartmentRepository
    private DepartmentRepository departmentRepository;
    
    @InjectMocks  // inyectamos el mock en el servicio para que se pueda usar en las pruebas
    private DepartmentService departmentService;
    
    @Test  // anotacion para indicar que es una prueba      
    public void whenCreateDepartment_thenSuccess() {
        // Arrange (Preparación) 5️⃣
        // creamos los datos de prueba
        Department department = new Department();
        department.setName("IT");
        
        // configuramos el comportamiento del mock
        when(departmentRepository.existsByName("IT")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        
        // Act (Acción)
        // ejecutamos el metodo que queremos probar
        Department created = departmentService.create(department);
        
        // Assert (Verificación)
        // verificamos que el resultado es el esperado
        assertNotNull(created);
        assertEquals("IT", created.getName());
    }
    
    @Test
    void testCreateDepartmentWithExistingName() {
        // Arrange
        Department department = new Department();
        department.setName("IT");
        
        when(departmentRepository.existsByName("IT")).thenReturn(true);
        
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            departmentService.create(department);
        });
    }
}