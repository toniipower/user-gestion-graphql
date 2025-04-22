package com.arelance.gestor.controllers;


import com.arelance.gestor.dto.JwtResponse;
import com.arelance.gestor.dto.LoginRequest;
import com.arelance.gestor.dto.RegisterRequest;
import com.arelance.gestor.entities.Employee;
import com.arelance.gestor.repositories.EmployeeRepository;
import com.arelance.gestor.repositories.RoleRespository;
import com.arelance.gestor.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
public class AuthController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRespository rolRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) throws AuthenticationException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.createToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Employee employee = employeeRepository.findByEmail(userDetails.getUsername()).get();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    "Bearer",
                    employee.getEmail(),
                    employee.getRole().getErole().name()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Credenciales incorrectas");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> registrarEmpleado(@Valid @RequestBody RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (employeeRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body( "Email already in use");
        }

        // Verificar si el DNI ya existe
        if (employeeRepository.existsByDni(registerRequest.getDni())) {
            return ResponseEntity
                    .badRequest()
                    .body("DNI already in use");
        }

        // Crear nuevo empleado
        Employee employee = Employee.builder()
                .name(registerRequest.getName())
                .lastname(registerRequest.getLastname())
                .dni(registerRequest.getDni())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        // Asignar rol según la petición
        rolRepository.findByErole(registerRequest.getRol())
                .ifPresent(employee::setRole);

        // Guardar empleado
        employeeRepository.save(employee);

        // Crear token para autenticación automática
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.createToken(authentication);

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                "Bearer",
                employee.getEmail(),
                employee.getRole().getErole().name()
        ));
    }
}

