package com.arelance.gestor.dto;

import lombok.Data;

@Data
public class EmployeeInput {
    private String name;
    private String lastname;
    private String dni;
    private String email;
    private String password;
    private Long roleId;
    private Long departmentId;
} 