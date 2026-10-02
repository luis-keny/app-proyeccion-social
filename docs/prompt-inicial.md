## Decisiones funcionales confirmadas

### 1. Participación del estudiante

El estudiante **no necesita inscribirse previamente** en una actividad.

El flujo será:

```text
Administrador publica actividad
        ↓
Estudiante consulta la actividad
        ↓
Estudiante decide asistir
        ↓
Se presenta físicamente
        ↓
Asistente o administrador escanea su QR
        ↓
Confirma identidad
        ↓
Registra asistencia
```

Por lo tanto, no existirán conceptos como:

- Inscripción.
- Cupo reservado.
- Solicitud de participación.
- Lista previa de inscritos.

La participación se determinará directamente mediante la asistencia registrada.

---

### 2. Registro de asistencia por rol

Tanto el rol **Asistente** como el rol **Administrador** podrán registrar asistencias.

Los permisos relacionados con asistencia quedarán:

| Rol | Consultar actividades | Mostrar QR | Registrar asistencia |
|---|---:|---:|---:|
| Estudiante | Sí | Sí | No |
| Asistente | Sí | Sí | Sí |
| Administrador | Sí | Opcional | Sí |

El administrador tendrá acceso al mismo flujo de escaneo utilizado por el asistente.

Esto permite que, si no existe un asistente disponible durante una actividad, el administrador pueda realizar directamente el control de asistencia.

---

### 3. Finalización obligatoria de actividades

Toda actividad debe tener una condición de finalización.

No existirán actividades indefinidas.

El administrador podrá configurar:

#### Actividad de un solo día

```text
Fecha:
10/10/2026

Horario:
08:00 - 12:00
```

La actividad finaliza ese mismo día.

#### Actividad recurrente hasta una fecha

```text
Inicio:
05/10/2026

Horario:
08:00 - 12:00

Repetición:
Todos los lunes

Finaliza:
30/11/2026
```

#### Actividad recurrente por número de ocurrencias

```text
Inicio:
05/10/2026

Horario:
08:00 - 12:00

Repetición:
Todos los lunes

Finaliza después de:
8 ocurrencias
```

Por lo tanto, siguiendo una experiencia similar a Google Calendar, el campo **Finaliza** tendrá únicamente:

```text
○ En una fecha
○ Después de X ocurrencias
```

No existirá:

```text
○ Nunca
○ Sin fecha de finalización
```

---

## Estados de actividad actualizados

Con esta regla, los estados pueden automatizarse mejor.

### Estados administrativos

Controlados explícitamente por el administrador:

- **Borrador**
- **Publicada**
- **Cancelada**

### Estados temporales

Calculados automáticamente por el sistema:

- **Próxima**
- **En curso**
- **Finalizada**

Ejemplo:

```text
Actividad publicada

Inicio:
05/10/2026

Fin:
30/11/2026
```

Antes del 5 de octubre:

```text
Próxima
```

Entre el 5 de octubre y el 30 de noviembre:

```text
En curso
```

Después de completar su última sesión:

```text
Finalizada
```

No será necesario que un administrador marque manualmente una actividad como finalizada.

---

## Excepción: cancelación

El administrador sí puede intervenir manualmente mediante:

```text
Cancelar actividad
```

Esto afecta toda la actividad.

También debe existir:

```text
Cancelar sesión
```

para cancelar únicamente una ocurrencia.

Ejemplo:

```text
Actividad: Apoyo comunitario
Todos los lunes de octubre

05 Oct   ✓ Realizada
12 Oct   ✓ Realizada
19 Oct   ✕ Cancelada
26 Oct   ✓ Programada
```

Cancelar el 19 de octubre no cancela toda la actividad.

---

## Navegación actualizada por rol

### Estudiante

```text
Inicio
├── Resumen de horas
├── Próximas actividades
└── Actividad reciente

Mi progreso
├── Horas por ciclo
├── Historial de actividades
└── Historial de asistencias

Actividades
├── Actividades disponibles
└── Detalle de actividad

Mi QR
└── Identificación para asistencia

Perfil
```

### Asistente

```text
Inicio

Mi progreso

Actividades

Registrar asistencia
├── Seleccionar actividad
├── Escanear QR
├── Identificar estudiante
├── Confirmar estudiante
└── Registrar asistencia

Mi QR

Perfil
```

### Administrador

```text
Dashboard

Actividades
├── Listado
├── Crear
├── Editar
├── Detalle
├── Sesiones
└── Asistencias

Estudiantes
├── Horas por ciclo
└── Detalle del estudiante

Usuarios
└── Gestión de roles

Registrar asistencia
├── Seleccionar actividad
├── Escanear QR
├── Identificar estudiante
├── Confirmar estudiante
└── Registrar asistencia

Configuración
```

---

## Regla importante sobre la asistencia

Debido a que no existe inscripción previa, cualquier estudiante institucional puede potencialmente asistir a una actividad publicada.

Por tanto, el criterio de participación será:

```text
Participó = existe asistencia válida
```

y no:

```text
Participó = estaba inscrito
```

La asistencia será la fuente principal para determinar:

- Participación.
- Cumplimiento.
- Número de sesiones asistidas.
- Horas obtenidas.
- Historial del estudiante.