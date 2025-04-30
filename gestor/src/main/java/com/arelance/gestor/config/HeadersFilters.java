package com.arelance.gestor.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

@Component
public class HeadersFilters implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse res = (HttpServletResponse) response;

        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

        res.setHeader("Content-Security-Policy",
                "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; " +
                        "style-src 'self' https://cdn.jsdelivr.net; connect-src 'self' http://localhost:8080; "
                        +
                        "form-action 'self' http://localhost:8080; base-uri 'self'; object-src 'none'; frame-ancestors 'none';");

        chain.doFilter(request, response);
    }
}
