/// <reference types="cypress" />
// @ts-nocheck
describe('Prueba de inicio de sesión', () => {
    beforeEach(() => {
      // Visitar la página de inicio de sesión antes de cada prueba
      cy.visit('/');
    });
    it('debería mostrar el formulario de inicio de sesión', () => {
      // Verificar que los elementos del formulario estén presentes
      cy.get('form').should('exist');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
    it('debería mostrar un mensaje de error con credenciales inválidas', () => {
      // Intentar iniciar sesión con credenciales incorrectas
      cy.get('#email').type('aaadmiin2@example.com');
      cy.get('#password').type('malisima');
      cy.get('button[type="submit"]').click();
      // Verificar que se muestra un mensaje de error
      cy.get('[data-cy="login-error"]').should('be.visible').and('contain', 'Error de autenticación');

    //   cy.get('.error-message', { timeout: 10000 }).should('be.visible');
    //   cy.get('.error-message').should('contain', 'Credenciales inválidas');
    });
    it('debería iniciar sesión exitosamente con credenciales válidas', () => {
      // Intentar iniciar sesión con credenciales correctas
      cy.get('#email').type('admin2@example.com');
      cy.get('#password').type('123456');
      cy.get('button[type="submit"]').click();
      // Verificar que se redirige al dashboard después del inicio de sesión exitoso
      cy.url().should('include', '/employees');
    });
  });