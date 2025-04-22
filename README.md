# User Gestión

Este proyecto es un sistema de gestión de usuarios que permite administrar roles y empleados.

## Requisitos Previos

- Node.js y npm
- MySQL Workbench
- Java JDK 8
- Maven
- Angular CLI 16
- Spring Boot 2.7.18

## Clonar el Proyecto

```bash
git clone http://gitlabidi.arelance.com/antonio.heredia/user-gestion.git
cd user-gestion
```

## Pasos para Iniciar el Proyecto

1. **Instalación del Frontend**
   ```bash
   cd user-front
   npm install
   ```

2. **Configuración de la Base de Datos**
   - Abre MySQL Workbench
   - Asegúrate de que el servidor MySQL esté en ejecución

3. **Inicio del Backend**
   - Inicia el proyecto Java (Spring Boot)
   - El proyecto creará automáticamente el schema en MySQL Workbench según la configuración en `application.properties`

4. **Configuración Inicial de Roles**
   - En MySQL Workbench, navega a la tabla `rol`
   - Añade manualmente los siguientes roles:
     - ADMIN
     - CONSULTANT

5. **Creación de Usuario Administrador**
   - Una vez configurados los roles, añade un empleado con rol ADMIN
   - Este usuario tendrá acceso completo al sistema

## Notas Adicionales

- Asegúrate de que el servidor MySQL esté en ejecución antes de iniciar el backend
- Verifica que los puertos necesarios estén disponibles
- En caso de problemas con la conexión a la base de datos, revisa la configuración en `application.properties`

## Versiones Utilizadas

- Angular: 16.x
- Java: 8
- Spring Boot: 2.7.18

# user-gestion
