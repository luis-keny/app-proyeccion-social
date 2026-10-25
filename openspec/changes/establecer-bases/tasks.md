# Trabajo de las bases

## Documentación

- [x] 1.1 Contrastar reglas confirmadas con código y documentos históricos.
- [x] 1.2 Inicializar OpenSpec y redactar escenarios de actividades, asistencia y progreso.
- [x] 1.3 Documentar autoridad humana, navegación y mantenimiento obligatorio.
- [x] 1.4 Consolidar docs en producto, arquitectura, datos, desarrollo, operación y decisiones.
- [x] 1.5 Añadir convenciones, incluida la regla de números mágicos.
- [x] 1.6 Actualizar referencias, retirar duplicados y verificar integridad documental.

## Definición pendiente

- [ ] 2.1 Resolver preguntas de identidad, ciclos, permisos y acreditación.
- [ ] 2.2 Aceptar diseño técnico y definir próximos cambios de implementación.
- [ ] 2.3 Obtener aceptación del resultado documental.
- [ ] 2.4 Consolidar requisitos revisados y cerrar cuando se autorice.

## Evidencia

- OpenSpec: `validate establecer-bases --strict`, salida 0.
- Comprobación de Markdown y enlaces locales sin referencias retiradas ni espacios finales; revisión adicional de codificación UTF-8.
- Bloques administrados Next.js/InsForge conservados frente a HEAD; CLAUDE mantiene su referencia a AGENTS.
- `git diff --check`: salida 0; aviso de conversión LF/CRLF de CLAUDE sin errores de contenido.
- Docs queda en 11 archivos, incluidos índice y decisiones. Se retiraron duplicados y el prompt histórico tras integrar sus reglas útiles.

Este cambio no implementa capacidades funcionales. No se ejecutan build ni pruebas de aplicación por cambios exclusivamente documentales.
