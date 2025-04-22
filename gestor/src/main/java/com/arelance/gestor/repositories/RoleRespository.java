package com.arelance.gestor.repositories;

import com.arelance.gestor.enums.Erole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.arelance.gestor.entities.Role;

import java.util.Optional;

@Repository
public interface RoleRespository extends JpaRepository<Role, Long> {
    Optional<Role> findByErole(Erole erole);
    boolean existsByErole(Erole erole);
    
}
