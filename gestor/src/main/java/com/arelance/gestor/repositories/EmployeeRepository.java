package com.arelance.gestor.repositories;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.arelance.gestor.entities.Employee;

import javax.validation.constraints.Email;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    public List<Employee> findByNameContaining(String name);

    public Optional<Employee> findById(Long id);

    boolean existsByEmail( String email);
    boolean existsByDni(String dni);

    Optional<Employee> findByEmail(String email);
}
