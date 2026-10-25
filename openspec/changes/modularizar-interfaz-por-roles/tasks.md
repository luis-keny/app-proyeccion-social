# Trabajo de interfaz modular

## Implementación

- [x] 1.1 Documentar reglas de diseño, alcance visual y matriz de roles.
- [x] 1.2 Separar módulos, vistas y datos de ejemplo; centralizar navegación.
- [x] 1.3 Sustituir controles nativos visibles y usar Drawer derecho en altas/ediciones.
- [x] 1.4 Añadir confirmación de eliminación con acción roja y cancelación segura.
- [x] 1.5 Verificar tipos, lint, build, coherencia documental y OpenSpec; registrar límites.

## Navegación y layout de workspace

- [x] 3.1 Separar las vistas en páginas navegables dentro de app y validar combinaciones de rol/vista.
- [x] 3.2 Reutilizar el scaffold de workspace como layout compartido y parametrizar sus componentes internos.
- [x] 3.3 Mantener datos en memoria entre navegaciones y conservar Drawer derecho en móvil.
- [x] 3.4 Presentar navegación, etiquetas accesibles, páginas y errores en español.
- [x] 3.5 Comprobar enlaces directos, atrás/adelante, cambio de rol, CRUD entre páginas y layout responsive; ejecutar checks.

## Aceptación

- [ ] 2.1 Obtener aceptación humana del resultado.
- [ ] 2.2 Consolidar y archivar solo con cierre autorizado.

## Evidencia

### Primera separación

- `node node_modules/typescript/bin/tsc --noEmit`: salida 0.
- `node node_modules/eslint/bin/eslint.js .`: salida 0, sin errores. Conserva cuatro advertencias: tres en plantillas de skills y una por las imágenes de tiles del mapa trasladado.
- `node node_modules/next/dist/bin/next build --webpack`: compilación, TypeScript y prerender completados; rutas `/`, `/_not-found` y `/workspace`.
- El build predeterminado con Turbopack falló al iniciar el subproceso de CSS en el sandbox. Un intento con Webpack dentro del sandbox falló por `EPERM` creando un directorio generado. La ejecución local autorizada por el revisor automático completó el build con Webpack; no se modificaron scripts ni configuración para eludir esos fallos.
- `openspec validate --all --strict`: dos cambios válidos, cero fallos. Se usó la CLI instalada con Node explícito porque el shim de nvm no tiene versión activa.
- `git diff --check`: salida 0. Comprobación de enlaces locales en 29 documentos: sin destinos faltantes.
- Chrome/Playwright contra el servidor local existente: navegación de los tres roles, filtros de reporte, creación/edición, cancelación de borrador, confirmación/cancelación de eliminación, nombres duplicados, estado sin actividades, validación de campos y Escape/retorno de foco comprobados.
- Drawer comprobado en escritorio de 1440 px y móvil de 390 px; capturas inspeccionadas visualmente. Sin errores de React en el flujo comprobado.
- No se verificó lectura QR real ni cámara/GPS en dispositivos del piloto. El registro continúa siendo una simulación sin persistencia, y no demuestra confirmación de identidad ni acreditación real.
- La consulta CLI de docs shadcn falló por DNS; se contrastaron las páginas oficiales y las APIs de los componentes instalados. Sin instalación de dependencias.

### Navegación de workspace

- Seis archivos `page.tsx` de vistas bajo `app/workspace/[role]/`, además de entradas de redirección y páginas no disponibles en español. El layout de `/workspace` conserva proveedor de datos y estructura de sidebar, contenido y breadcrumbs reutilizada del scaffold.
- `tsc --noEmit`: salida 0. Build con Webpack: compilación, tipos y prerender completados; entradas `/`, `/workspace`, `/workspace/[role]` y las seis rutas de vistas presentes en la salida.
- Lint sin errores, con las cuatro advertencias ya registradas en la primera separación. Sin nuevas dependencias ni cambios de configuración de build.
- Chrome/Playwright: once enlaces directos válidos por rol y una entrada activa en el sidebar; combinaciones no disponibles y dirección desconocida presentan mensajes en español y no montan el lector de asistencia.
- Comprobados navegación por enlaces, atrás/adelante, redirecciones de entrada, menú de usuario y sidebar colapsable. Las actividades creadas permanecen al volver desde reportes y cambiar de rol; creación, edición, cancelación y confirmación de eliminación siguen operativas en Drawer/AlertDialog.
- Drawer de navegación comprobado a 390 px: entra desde la derecha, cierra al elegir una vista y no introduce desbordamiento horizontal. Capturas de escritorio y móvil inspeccionadas visualmente.
- La consola y la inspección semántica detectaron Button renderizados como enlaces y cambio de `defaultOpen` en grupos Collapsible. Los enlaces de acción visual usan `ButtonLink` con `buttonVariants`, conservando su rol de enlace; los grupos usan estado controlado. El flujo final pasó con captura de consola sin avisos React/Base UI.
- Enlaces locales de 29 documentos y OpenSpec estricto comprobados. No se implementa autenticación ni persistencia; recargar conserva la URL pero reinicia los datos en memoria. Cámara/GPS reales en dispositivos del piloto siguen fuera de esta validación.
