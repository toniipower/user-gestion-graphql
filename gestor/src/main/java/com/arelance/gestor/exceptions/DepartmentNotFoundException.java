package com.arelance.gestor.exceptions;

public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(Long id) {
        super("Not found Department with id: " + id);
    }
}
