describe('Prueba del componente de lista de empleados', () => {
    beforeEach(() => {
      cy.visit('/employees'); // Asegúrate de que esta sea la ruta correcta
    });
  
    it('Debería mostrar la tabla de empleados con encabezados', () => {
      cy.get('table thead tr th').should('have.length', 8); // Verifica el número de columnas (incluyendo Acciones si isAdmin es true en la carga inicial)
      cy.get('table thead tr th:nth-child(2)').should('contain', 'Nombre');
      cy.get('table thead tr th:nth-child(3)').should('contain', 'Apellidos');
      // ... y así sucesivamente para las otras columnas
    });
  
    it('Debería mostrar al menos un empleado en la tabla', () => {
      cy.get('tbody tr').should('have.length.greaterThan', 0);
    });
  
    it('Debería mostrar los datos del primer empleado', () => {
      cy.get('tbody tr:first-child td:nth-child(2)').should('contain', 'Nombre del Empleado 1'); // Reemplaza con un nombre esperado
      cy.get('tbody tr:first-child td:nth-child(4)').should('contain', 'email1@ejemplo.com'); // Reemplaza con un email esperado
      // ... y así sucesivamente para otros datos
    });
  
    it('Debería mostrar la insignia de rol con la clase correcta', () => {
      cy.get('tbody tr:first-child .role-badge')
        .should('contain', 'ADMIN') // O 'CONSULTANT' según el primer empleado
        .should('have.class', 'role-admin'); // O 'role-consultant'
    });
  
    it('Debería mostrar el departamento del primer empleado', () => {
      cy.get('tbody tr:first-child .department-badge').should('contain', 'Departamento de Ventas'); // Reemplaza con un departamento esperado
    });
  
    context('Si el usuario es administrador', () => {
      // Aquí podrías simular el estado isAdmin() como true (si es necesario para la prueba)
      beforeEach(() => {
        // Ejemplo de cómo podrías interceptar una llamada para simular isAdmin()
        // cy.intercept('GET', '/api/user/isAdmin', { isAdmin: true });
        cy.visit('/employees');
      });
  
      it('Debería mostrar la columna de acciones', () => {
        cy.get('table thead tr th:last-child').should('contain', 'Acciones');
        cy.get('tbody tr:first-child .actions-cell').should('exist');
        cy.get('tbody tr:first-child .actions-cell .edit-button').should('contain', 'Editar');
        cy.get('tbody tr:first-child .actions-cell .delete-button').should('contain', 'Eliminar');
      });
  
      it('Debería hacer clic en "Editar" del primer empleado', () => {
        cy.get('tbody tr:first-child .actions-cell .edit-button').click();
        // Aquí podrías añadir aserciones sobre la navegación o el modal que se abre
        // Por ejemplo: cy.url().should('include', '/employees/edit/');
      });
  
      it('Debería hacer clic en "Eliminar" del primer empleado', () => {
        cy.intercept('DELETE', '/api/employees/*').as('deleteEmployee'); // Simula la llamada de eliminación
        cy.get('tbody tr:first-child .actions-cell .delete-button').click();
        // Aquí podrías añadir aserciones sobre el diálogo de confirmación (si existe)
        // o verificar que la llamada DELETE se realizó
        // cy.wait('@deleteEmployee').its('request.url').should('include', '/api/employees/1'); // Suponiendo que el ID del primero es 1
      });
    });
  
    context('Estados de carga y error', () => {
      it('Debería mostrar el estado de carga cuando isLoading es true', () => {
        // Aquí necesitarías una forma de simular el estado isLoading en true
        // Esto podría implicar interceptar la llamada inicial de los empleados y no responder inmediatamente
        cy.intercept('GET', '/api/employees', (req) => {
          req.reply({ delay: 1000, body: [] }); // Simula una respuesta tardía
        }).as('getEmployeesDelayed');
        cy.visit('/employees');
        cy.get('.loading-state').should('be.visible');
        cy.wait('@getEmployeesDelayed');
        cy.get('.loading-state').should('not.be.visible');
      });
  
      it('Debería mostrar el mensaje de error cuando errorMessage tiene un valor', () => {
        // Aquí necesitarías una forma de simular el estado errorMessage con un valor
        cy.intercept('GET', '/api/employees', { statusCode: 500, body: { message: 'Error al cargar los empleados' } }).as('getEmployeesError');
        cy.visit('/employees');
        cy.wait('@getEmployeesError');
        cy.get('.error-message').should('be.visible');
        cy.get('.error-message span').should('contain', 'Error al cargar los empleados');
      });
    });
  });