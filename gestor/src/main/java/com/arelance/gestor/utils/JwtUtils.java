package com.arelance.gestor.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${jwt.clave.secreta}")
    private String claveSecreta;

    @Value("${security.jwt.user.generador}")
    private String usuarioGenerador;

    @Value("${security.jwt.expiracion}")
    private  long expiracion;

    public String createToken(Authentication authentication){
        Algorithm algorithm = Algorithm.HMAC256(this.claveSecreta);

        String employee = authentication.getName();
        String authorities = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return JWT.create()
                .withIssuer(this.usuarioGenerador)
                .withSubject(employee)
                .withClaim("authorities", authorities)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiracion))
                .withJWTId(UUID.randomUUID().toString())
                .withNotBefore(new Date(System.currentTimeMillis()))
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(this.claveSecreta);

            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(this.usuarioGenerador)
                    .build();

            return verifier.verify(token);
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Token inválido, no autorizado");
        }
    }

    public String extractUser(DecodedJWT decodedJWT){
        return decodedJWT.getSubject();
    }

    public Claim getEspecificClaim(DecodedJWT decodedJWT, String claimName) {
        return decodedJWT.getClaim(claimName);
    }

    public Boolean validateJwtToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(this.claveSecreta))
                    .withIssuer(this.usuarioGenerador)
                    .build()
                    .verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public String getUserNameFromJwtToken(String token) {
        return extractUser(validateToken(token));
    }
}