package com.arelance.gestor.dto;

import com.arelance.gestor.enums.Erole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    private String name;

    private String lastname;

    @NotBlank
    @Size(min = 9, max = 9)
    private String dni;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private Erole rol = Erole.CONSULTANT;
}
