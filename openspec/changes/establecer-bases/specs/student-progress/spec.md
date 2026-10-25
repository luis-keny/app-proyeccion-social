## Purpose

Definir la consulta del progreso individual y su desglose por ciclo desde asistencias válidas, con protección de datos de otros estudiantes.

## ADDED Requirements

### Requirement: Progreso derivado de asistencia
El sistema SHALL mostrar al estudiante su acumulado histórico y subtotales por ciclo derivados exclusivamente de créditos de asistencias válidas.

#### Scenario: Participación en dos ciclos
- **WHEN** el estudiante tiene asistencias válidas en dos ciclos distintos
- **THEN** ve el subtotal de cada ciclo y un acumulado igual a la suma de ambos

### Requirement: Acceso al progreso propio
El sistema SHALL impedir que un estudiante sin privilegios administrativos consulte progreso individual ajeno. Requisito de seguridad propuesto.

#### Scenario: Cambio de identificador
- **WHEN** el estudiante modifica un identificador de consulta para solicitar el progreso de otro estudiante
- **THEN** el sistema deniega el acceso y no devuelve datos personales ni horas ajenas

### Requirement: Anulaciones coherentes
El sistema SHALL excluir del total el crédito de una asistencia anulada y conservar su trazabilidad. El procedimiento y permiso de anulación se resolverán mediante P-06.

#### Scenario: Asistencia anulada
- **WHEN** una asistencia deja de ser válida mediante el procedimiento autorizado
- **THEN** su crédito deja de contar en el ciclo y acumulado y permanece consultable el historial autorizado

Decisiones sin resolver: [preguntas del cambio](../../questions.md).
