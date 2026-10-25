## Purpose

Definir registro autorizado y confirmado de participación, con crédito fijo por sesión e integridad ante intentos duplicados.

## ADDED Requirements

### Requirement: Registro por operador autorizado
El sistema SHALL permitir registrar asistencia únicamente a asistentes o administradores autorizados para la sesión. El alcance de asignación se resolverá mediante P-04.

#### Scenario: Intento de estudiante
- **WHEN** un usuario con solo rol estudiante intenta registrar asistencia
- **THEN** el sistema deniega la operación sin crear registro ni crédito

### Requirement: Confirmación de identidad
El sistema SHALL exigir confirmación explícita de identidad antes de persistir asistencia; escanear el QR no la registra por sí solo.

#### Scenario: QR resuelto sin confirmación
- **WHEN** un operador escanea un QR válido y todavía no confirma la identidad
- **THEN** se muestra la identidad permitida y no existe nueva asistencia ni crédito

### Requirement: Crédito fijo por sesión
El sistema SHALL acreditar la cantidad fija configurada para la sesión cuando se registra una asistencia válida, sin requerir fichaje de salida.

#### Scenario: Confirmación válida
- **WHEN** un operador autorizado confirma al estudiante en una sesión habilitada con crédito fijo configurado
- **THEN** el sistema registra la asistencia y acredita una vez esa cantidad

### Requirement: Integridad ante duplicados
El sistema SHALL impedir que múltiples solicitudes para el mismo estudiante y sesión generen crédito adicional. Requisito técnico propuesto para evitar crédito duplicado.

#### Scenario: Dos operadores concurrentes
- **WHEN** dos operadores confirman simultáneamente al mismo estudiante en la misma sesión
- **THEN** queda una sola asistencia efectiva y un único crédito de sesión

Decisiones sin resolver: [preguntas del cambio](../../questions.md).
