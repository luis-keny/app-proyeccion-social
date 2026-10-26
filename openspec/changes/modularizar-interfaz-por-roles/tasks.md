# Trabajo de interfaz modular

## Commit del conjunto visual actual

- Autorización humana de commit local de todos los cambios pendientes registrada en review.md, sobre main.
- Inventario: ocho archivos de código, documentación y OpenSpec; incluye la retirada del área de las cards junto con los cambios del reporte. Sin archivos nuevos, secretos ni dependencias.
- Se conservan las comprobaciones ya registradas de tipos, lint, build, escenarios y navegador. Antes del commit se comprueban diff y validación OpenSpec estricta; no se modifica implementación en esta preparación. Sin push ni archivo del cambio.

## Iconos y ejemplos externos en el reporte

- [x] Registrar autorización humana para retirar sufijos, añadir ejemplos de voluntariados y distinguir tipos con iconos.
- [x] Limpiar los seis códigos universitarios; añadir dos beneficiarios con DNI ficticio e historial coherente.
- [x] Mostrar birrete azul y voluntariado verde con nombre accesible del tipo; mantener el botón sin padding adicional.
- [x] Adaptar detalle externo, contadores y opción Personas externas; actualizar docs y specs.
- [x] Verificar render, coherencia de ejemplos, tipos, lint, build, OpenSpec y navegador.

### Evidencia de iconos y ejemplos

- Build Webpack: salida 0, incluida comprobación TypeScript. Posteriormente se ajustaron textos para identificar participantes y no atribuir GPS a los ejemplos externos. Lint de reportes: sin errores ni advertencias; comprobación final de tipos y lint tras esos textos, salida 0.
- Escenarios en memoria sobre fixtures y componente real: seis códigos contienen solo dígitos, dos beneficiarios tienen código nulo y DNI; sus ocho resúmenes coinciden con horas y cantidad de registros del historial. Render sin sufijos EST y con iconos de ambos colores y DNI externos.
- Navegador: ocho filas, seis birretes azules y dos iconos verdes, códigos limpios y DNI externos. Personas externas filtra dos filas. Elena abre su detalle con DNI, etiqueta Beneficiario externo, cuatro voluntariados y 46 h, sin código vacío ni escuela/ciclo actual. Recarga restablece filtros. Captura final de escritorio revisada con las ocho filas visibles.
- OpenSpec estricto: dos cambios válidos tras separar requisitos extensos. `git diff --check`: correcto. No se añaden dependencias ni se modifican datos reales. Se preservan los cambios previos de actividades y reportes. Móvil no comprobado en esta iteración; resultado y cierre pendientes de aceptación humana, sin commit ni push.

## Simplificación del reporte administrativo

- [x] Registrar la petición humana, alcance autorizado y diseño compacto.
- [x] Retirar información secundaria y detalle duplicado; conservar apertura desde el nombre sin padding, realizadas/totales y horas por ciclo.
- [x] Mostrar un identificador según tipo de participante y conservar los filtros existentes.
- [x] Actualizar documentación, delta spec y verificar código y flujo.

### Evidencia de simplificación

- Build: `node node_modules/next/dist/bin/next build --webpack`, salida 0; incluye compilación, TypeScript y generación de páginas.
- Lint completo: sin errores, cuatro advertencias previas de plantillas de skills y mapa, más un import Eye que se retiró al simplificar la tabla. Lint posterior de `modules/reports`: salida 0 sin advertencias.
- Render del componente real mediante transpilación TypeScript en memoria y `renderToStaticMarkup`: estudiante muestra código y oculta DNI; al sustituir temporalmente un registro en memoria por beneficiario sin código, muestra DNI y oculta código. Sin correo ni acción de detalle duplicada en la tabla. No se cambiaron fixtures en disco para esta comprobación.
- Navegador local: tabla de siete columnas con cuatro ciclos, sin datos secundarios; nombre abre el detalle y Volver restaura el listado. Estado Observado muestra una fila. Año 2026 oculta las columnas de 2025 y mantiene 148.5/160 h del primer registro. Se restablecieron Todos y ambos años. Captura de escritorio revisada: nombre alineado sin padding adicional.
- OpenSpec: `validate --all --strict`, dos cambios válidos; `git diff --check`, correcto. CLI shadcn docs falló por DNS; se consultaron las páginas oficiales de Button/Table y las primitivas instaladas. Se usó Node del runtime de Codex porque el shim nvm no tenía versión activa.
- No se verificó este ajuste en móvil ni con backend; los ejemplos actuales siguen siendo estudiantes. Durante la verificación apareció un cambio ajeno en `modules/activities/ui/activity-card.tsx`, que se preservó. Sin commit, push ni cierre; aceptación del resultado pendiente.

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

## Retirada de área en cards

- [x] Retirar la etiqueta de área del componente compartido de cards y su import/desestructuración sin uso; actualizar docs/design.md, diseño, spec y autorización del cambio.
- [x] Verificar ESLint del componente y TypeScript: salida 0, con el runtime Node explícito porque el shim de nvm no tiene versión activa.
- [x] Build Webpack: salida 0, rutas existentes conservadas. El primer intento falló por EPERM durante prerender dentro del sandbox; repetición fuera del sandbox autorizada por el revisor automático completada.
- [x] OpenSpec estricto: dos cambios válidos, cero fallos. Diff sin errores de espacios. Inspección del componente confirma ausencia del área para todos los roles; sin prueba de navegador en esta tarea. No se añadieron enlaces documentales ni dependencias; se preservan cambios previos del reporte. Aceptación del resultado y cierre pendientes.

## Aceptación humana pendiente

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

## Programación, horas y animaciones

- [x] 4.1 Registrar ampliación humana, discrepancia con crédito fijo inicial y límites visuales.
- [x] 4.2 Animar drawers compartidos, esperar cierre del editor y respetar movimiento reducido.
- [x] 4.3 Configurar días independientes, recurrencia finita y horario común con controles instalados.
- [x] 4.4 Configurar tres reglas de horas, validar cantidades y comunicar resumen en formulario/cards.
- [x] 4.5 Verificar tipos, lint, build, OpenSpec y flujos visuales; registrar resultados y límites.

### Programación y horas

- TypeScript (`node node_modules/typescript/bin/tsc --noEmit`): salida 0.
- Lint (`node node_modules/eslint/bin/eslint.js .`): salida 0, las cuatro advertencias previas (plantillas de skills y tiles del mapa), sin advertencias nuevas.
- Build final (`node node_modules/next/dist/bin/next build --webpack`): compilación, tipos, prerender y trazas completados; conserva las rutas existentes. La primera ejecución dentro del sandbox encontró EPERM al crear un directorio de prerender; se completó fuera del sandbox con autorización del revisor automático, sin modificar configuración.
- OpenSpec (`openspec validate --all --strict` con Node explícito): dos cambios válidos, cero fallos. Sigue sin existir baseline consolidada.
- Escenarios ejecutados directamente contra scheduling.ts: repetición diaria en año bisiesto, semanal cruzando de año, límite de 366, rechazo de cero/negativos/fracciones/exceso/no finitos y resúmenes de las tres reglas, correctos. Node emitió aviso de detección automática de módulo al ejecutar el TS directamente; no se modificó package.json.
- Navegador local: creación de cinco jornadas diarias con mínimo tres y diez horas, resumen en card y recuperación al editar; rechazo de mínimo seis para cinco días y de horario inverso. Comprobadas repetición semanal, selección/desmarcado de fechas entre meses y resúmenes de asistencia completa y una hora por asistencia.
- Cancelar descarta el borrador; Escape cierra. Medidas DOM: entrada configurada 0.36 s; durante salida, panel presente con data-ending-style, duración 0.24 s y desplazamiento hacia la derecha; después se desmonta y el foco vuelve al botón de edición. Se impiden envíos durante cierre y sustitución del editor mientras termina su salida. Captura de escritorio inspeccionada visualmente; sin avisos ni errores en la consola observada.
- Movimiento reducido implementado mediante CSS, sin emulación de esa preferencia en esta sesión. No se repitió la prueba móvil, ni se verificó cámara/GPS, calendario externo, persistencia ni crédito real.
- Consulta CLI shadcn falló por DNS; se consultaron documentos oficiales y tipos del paquete instalado, sin instalar dependencias.
- Enlaces locales en 30 documentos: sin destinos faltantes. git diff --check: salida 0.

## Refinamiento del editor y mapa

- [x] 5.1 Registrar alcance y sustitución visual de la restricción de recurrencia finita.
- [x] 5.2 Añadir descripción, reordenar ubicación y distinguir secciones con textos breves.
- [x] 5.3 Separar arrastre/selección del mapa y representar radio geográfico de 50 metros.
- [x] 5.4 Sustituir Calendar por fecha y reglas de repetición, días personalizados y tres terminaciones.
- [x] 5.5 Añadir sugerencias de hora y registrar ruedas móviles pendientes.
- [x] 5.6 Verificar escenarios de recurrencia/mapa, UI, tipos, lint, build, enlaces y OpenSpec.

### Refinamiento del editor y mapa

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit`, salida 0. Lint completo: salida 0 con cuatro advertencias previas (tres de plantillas de skills y tiles del mapa); lint de actividades tras ajustes accesibles: sin errores, misma advertencia del mapa.
- Build con Webpack fuera del sandbox, usando la autorización local de ejecución: compilación, tipos, prerender y trazas completos, sin cambios en rutas ni dependencias.
- Escenarios directos contra scheduling.ts: día único; lunes/miércoles cada dos semanas; exclusión de días anteriores al inicio; fin inclusivo; rango sin coincidencias; fecha inválida; bisiesto; cambio de año; cantidades inválidas; serie abierta con intervalo amplio y muestra acotada; resumen unitario sin máximo ficticio. Correctos. Node conserva el aviso de detección de módulo al ejecutar TS directamente, sin cambiar package.json.
- Navegador local: arrastre con ratón desplaza el mapa y conserva coordenadas; clic posterior cambia ubicación. Ampliar duplica el diámetro en píxeles de 85.61 a 171.23 y conserva el punto y radio de 50 m. Flechas conservan la selección y Enter selecciona el centro. Reabrir edición recupera coordenadas/radio y descripción.
- Guardada actividad personalizada de lunes/miércoles con tres jornadas y horario 08:00–10:30; la card muestra descripción, rango y horas correctos. Escribir 8 y abandonar el campo produce 08:00; seleccionar sugerencia 10:30 la conserva al guardar. Botones de sugerencias tienen etiquetas accesibles en español.
- Comprobados cambio a serie abierta, rechazo de Todas las jornadas sin terminación y guardado Por asistencia con etiqueta sin fecha de fin y sin máximo. Cambiar a fin por fecha 28/10/2026 produce dos jornadas inclusivas. Día único oculta terminación y genera una jornada, sin Calendar en DOM. Cancelar descarta el borrador y conserva la serie guardada.
- Capturas de escritorio y móvil 390×844 inspeccionadas. Columnas, botones de lunes a domingo, mapa, encabezados y pie de acciones caben; contenido sin desbordamiento horizontal (374 px de ancho visible y desplazable). Se acortó la opción a Día único tras revisar espacio móvil. Preferencia temporal de viewport restablecida. Consola observada sin avisos ni errores.
- OpenSpec estricto: dos cambios válidos; se dividieron requisitos extensos en unidades verificables antes de la validación final. Enlaces locales: 30 documentos sin destinos faltantes. `git diff --check`: correcto.
- No se probaron gestos en dispositivo táctil físico ni ruedas de reloj, que quedan pendientes. El radio solo indica ubicación; no se verificó GPS real, backend, acreditación, calendario externo ni persistencia. Sin commit ni archivo del cambio.

## Cards y detalle

- [x] 6.1 Registrar conformidad anterior y autorización visual para cards/detalle.
- [x] 6.2 Resumir información relevante en cards y completar ejemplos coherentes.
- [x] 6.3 Añadir ruta de detalle, programación, jornadas, horas y mapa de consulta.
- [x] 6.4 Integrar enlaces, migas, navegación activa, vuelta y estado de ID ausente.
- [x] 6.5 Verificar roles, navegación, memoria, mapa de consulta, recurrencias, responsive, tipos, lint, build y OpenSpec.

### Cards y página de detalle

- `tsc --noEmit`: salida 0. Lint completo: salida 0, conserva las cuatro advertencias previas de plantillas de skills y tiles del mapa, sin errores nuevos.
- Build Webpack fuera del sandbox con autorización local: compilación, tipos, prerender y trazas completos; nueva ruta `/workspace/[role]/actividades/[activityId]` presente junto con las existentes.
- Escenarios ejecutados contra las funciones reales de presentación mediante transpilación TypeScript en memoria: hora de Lima frente a UTC, inclusión de jornada hasta su hora final, exclusión al llegar al fin, programación finita terminada, recurrencia/terminación y serie abierta fuera de su muestra inicial. Correctos; sin instalar runner ni generar archivos de prueba.
- Navegador: las cards muestran las tres reglas ilustrativas, descripciones recortadas, fecha/horario, recurrencia y enlace de detalle. Verificado detalle de estudiante sin botón de registro, detalle de asistente con botón y detalle de administrador con actividad creada durante la sesión. Descripción completa, programación, condiciones y coordenadas coherentes.
- Creada actividad de ocho jornadas: el detalle muestra seis al inicio y ocho al expandir. Registrar asistencia desde detalle selecciona esa actividad en el flujo existente. Volver con historial mantiene sus datos; recargar reinicia el proveedor y muestra Actividad no disponible con enlace de recuperación. No se aceptaron permisos nuevos ni se validó cámara/GPS real.
- El mapa de consulta conserva coordenadas con flechas y Enter y permite explorar sin edición. La selección y el radio se muestran, sin montar formularios. Las migas contienen Actividades/Detalle y la navegación mantiene Actividades activa.
- Capturas de cards y detalle de escritorio inspeccionadas. Cards y detalle a 390×844 comprobados con rol asistente: ancho desplazable de 375 px frente a viewport de 390 px, sin desbordamiento horizontal, cards en columna y detalle apilado. Override de viewport restablecido. Consola de la consulta estudiantil sin avisos ni errores.
- OpenSpec estricto: dos cambios válidos; enlaces locales en 30 documentos sin destinos faltantes; `git diff --check` correcto. Consulta CLI shadcn falló por DNS y se contrastaron documentación oficial y componentes instalados.
- Los ejemplos nuevos son ilustrativos y deterministas, sin actividad institucional real. La referencia temporal se toma al renderizar la página y no se actualiza como reloj. No se implementaron persistencia, permisos efectivos, inscripción ni crédito real. Sin commit, push o cierre del cambio; aceptación de esta entrega pendiente.

### Preparación del commit autorizado

- Mensaje humano «comitea todo»: alcance de commit local del conjunto pendiente registrado en review.md, sobre main y sin push.
- Inventario revisado: código, documentación y OpenSpec de las entregas visuales de esta conversación; se incluyen los archivos nuevos de programación, presentación, horarios y detalle. No se incluyen archivos de entorno ni dependencias.
- Se conservan las comprobaciones de tipos, lint, build y flujos ya registradas; no se modificó implementación después de esas comprobaciones. Validación OpenSpec y diff se comprueban de nuevo al preparar el commit. El commit no consolida ni archiva specs.

## Limpieza de reporte y detalle

- [x] Registrar petición y autorización visual local en review.md.
- [x] Actualizar título/descripción general y retirar indicadores y cabecera redundante de la tabla.
- [x] Retirar resumen anual/por ciclo y columna Eje de impacto del detalle, conservando filtros del historial.
- [x] Actualizar docs/design.md, propuesta, diseño y delta spec; verificar interfaz y código.

### Evidencia de limpieza

- Lint completo: salida 0, sin errores; cuatro advertencias previas en plantillas de skills y tiles del mapa.
- TypeScript: `tsc --noEmit`, salida 0. Build: `next build --webpack`, salida 0, compilación, tipos y generación de páginas completos. Primer intento dentro del sandbox bloqueado por EPERM en .next; repetición fuera del sandbox autorizada por el revisor automático completada sin cambiar configuración.
- OpenSpec: `validate --all --strict`, dos cambios válidos y cero fallos. Se ejecutó la CLI instalada con Node explícito porque el shim nvm no tiene versión activa.
- Navegador local: título/descripción actualizados; tabla de ocho participantes con filtros, sin indicadores superiores ni cabecera consolidada. Nombre abre ficha e historial de cinco columnas, sin resumen anual/por ciclo ni Eje de impacto. Filtro 2025-I muestra la única actividad correspondiente; Todos restaura las diez filas y Volver restaura el listado. Capturas de escritorio de reporte y detalle inspeccionadas visualmente.
- No se probó móvil en esta tarea ni backend/persistencia. Se conservan los datos de ejemplo y los indicadores del módulo Resumen general. Documentación de diseño actualizada; sin enlaces nuevos. Sin commit, push ni cierre; aceptación humana del resultado pendiente.

### Commit de la limpieza

- Autorización humana de commit local registrada en review.md. Inventario: ocho archivos de código, diseño y OpenSpec correspondientes a la limpieza entregada, sin archivos de entorno ni dependencias. Se conservan las verificaciones de implementación anteriores; solo se añade el registro documental de esta autorización. El commit no consolida ni archiva specs.
