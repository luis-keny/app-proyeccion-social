# Operación

Aún no hay un despliegue ni procedimientos de recuperación verificados.

## Entornos y configuración

Separar desarrollo y producción; añadir staging si el piloto lo necesita. Usar datos sintéticos fuera de producción. No asumir que el proyecto InsForge vinculado es descartable.

Credenciales fuera de Git. Documentar nombres de variables necesarias sin valores secretos. Nunca exponer claves administrativas en variables públicas, navegador, QR o logs.

## Entrega y recuperación

Antes de desplegar, definir entorno, dominio, callbacks de autenticación, configuración, migraciones, responsables y verificaciones. La autorización debe cubrir los efectos sobre servicios y datos.

Acordar backup, pérdida de datos tolerable y tiempo de recuperación. Ensayar restauración en un entorno aislado. Revertir código no revierte automáticamente una migración ni recupera datos eliminados.

Registrar errores, denegaciones, latencia y resultados de asistencia con identificadores de correlación, sin tokens ni datos personales innecesarios.

## Límites a resolver antes del piloto

| Área | Decisión o comprobación necesaria |
|---|---|
| Cámara y lector QR | HTTPS, permisos y compatibilidad real de navegadores |
| GPS | Uso informativo u obligatorio, precisión y comportamiento sin permiso; no sustituirlo por coordenadas de demo |
| Mapas | Proveedor de tiles, política de uso y disponibilidad |
| Red | Reintentos idempotentes y procedimiento excepcional; no prometer sincronización offline |
| Capacidad | Usuarios, operadores simultáneos, carga, presupuesto y cuotas del backend |
| Privacidad | Retención, acceso a ubicación, exportaciones y responsable institucional |
| Soporte | Alta/baja de operadores, primer administrador, recuperación de cuenta y correcciones |

Documentar procedimientos concretos cuando se definan, antes de operar. Las decisiones abiertas se siguen en [OpenSpec](../openspec/changes/establecer-bases/questions.md).
