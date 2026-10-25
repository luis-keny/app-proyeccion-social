# Desarrollo

## Convenciones

- TypeScript con tipos explícitos en fronteras y validación de entradas en servidor.
- Módulos por negocio; componentes, funciones y contratos con una responsabilidad clara.
- SOLID proporcional: contratos pequeños, dependencias explícitas y composición. No crear una interfaz, clase o capa por rutina.
- Usar las primitivas existentes antes de añadir dependencias.
- Errores comprensibles y estables; no filtrar secretos ni detalles internos.
- Nombres de código en inglés y textos del producto/documentación en español.

### Números mágicos

Los valores que expresen reglas de negocio, límites, tiempos o configuración deben tener nombres descriptivos. Usar constantes del módulo para detalles técnicos fijos, configuración para valores de entorno y datos persistidos para reglas administrables.

```ts
const QR_TOKEN_TTL_MS = 5 * 60 * 1_000;
const expiresAt = Date.now() + QR_TOKEN_TTL_MS;
```

El valor del ejemplo es ilustrativo; no establece la vigencia del QR. No extraer valores obvios si reduce la claridad. Los límites funcionales también se especifican en OpenSpec.

## Validación

| Cambio | Comprobación |
|---|---|
| Documentación | Coherencia, enlaces y validación OpenSpec si se modifica |
| Código | Lint, build y comprobaciones del flujo afectado |
| Reglas de negocio | Escenarios de dominio, errores y límites |
| Persistencia o permisos | Integración, RLS, concurrencia y transacciones |
| Cámara, QR o ubicación | Pruebas en dispositivos y navegadores del piloto |

```bash
npm run lint
npm run build
```

No hay runner de pruebas configurado. Elegirlo antes de integrar backend. No añadir tests que solo repitan la implementación; verificar resultados y riesgos reales.

Antes del piloto deben demostrarse: denegación al estudiante que intenta registrar asistencia, confirmación obligatoria, crédito único bajo concurrencia, cancelación individual y conciliación de totales. Incluir teclado, foco, mensajes accesibles y alternativa autorizada a cámara.

## Trabajo y documentación

El procedimiento SDD y las autorizaciones están en [AGENTS.md](../AGENTS.md). Cada tarea actualiza su documento correspondiente sin duplicar contenido. Mantener una sola explicación por tema, sin versiones, diarios ni metadatos innecesarios en docs.

La secuencia prevista es definir contratos → identidad y datos → actividades/sesiones → asistencia/crédito → progreso/reportes → piloto. El detalle de tareas, preguntas y evidencia pertenece al cambio OpenSpec.
