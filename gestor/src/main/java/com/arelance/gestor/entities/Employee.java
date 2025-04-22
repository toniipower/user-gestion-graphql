package com.arelance.gestor.entities;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.*;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "employees")
public class Employee {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include 
    private Long id;

    @Column(nullable = false)
    @Size(min = 3, max = 50)
    private String name;
    private String lastname;
    @Column(nullable = false)
    private String dni;
    private String address;
    @Column(nullable = false)
    @Email(message = "Formato email no valido")
    private String email;
    @Column(nullable = false)

    @Size(min = 3)
    private String password;

    @ManyToMany
    @JoinTable(name = "employe_department", 
    joinColumns = @JoinColumn(name = "employee_id"),
    inverseJoinColumns = @JoinColumn(name = "department_id"))
    private Set<Department> departments;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
