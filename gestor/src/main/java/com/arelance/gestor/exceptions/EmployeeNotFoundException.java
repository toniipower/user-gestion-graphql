package com.arelance.gestor.exceptions;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Not found Employee with id: " + id);
    }
}
