# SaludYa · agenda de citas hexagonal (laboratorio de la sesión 3)

Repositorio de práctica del Módulo 1 del Diplomado en Desarrollo de Software Avanzado y Arquitectura de Aplicaciones.
No hay base de datos real, correo real ni datos reales: todo es en memoria o en un archivo JSON.

## Para empezar
Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm test
npm run typecheck
```

El material base llegó sin `src/` y con las pruebas en rojo. Esta entrega ya implementa `src/`; las pruebas originales no se modificaron.

## Decisiones de arquitectura
- `src/domain/` contiene las reglas de rangos, citas y agendas, sin depender de archivos ni de Node.js.
- `src/application/` coordina agendar y cancelar mediante los puertos `AgendaRepositorio`, `EventBus` y `GeneradorId`.
- Los repositorios de memoria y JSON implementan el mismo contrato: una agenda leída se puede modificar sin alterar lo guardado hasta llamar a `guardar`.
- `src/composicion.ts` es el único lugar que elige el adaptador de persistencia con `{ tipo: "memoria" }` o `{ tipo: "json", ruta }`.

Así, cambiar el almacenamiento no exige modificar `Agenda` ni `AgendarCita`: ambos dependen del contrato, no del adaptador concreto.

## Comprobación
Se ejecutaron en esta copia:

| Comando | Resultado |
| --- | --- |
| `npm test` | 34 pruebas superadas en 9 archivos |
| `npm run typecheck` | Sin errores |

También se comprobaron por separado las etapas de dominio, aplicación, memoria, arquitectura y JSON.

## Qué hay aquí
| Carpeta o archivo | Para qué |
| --- | --- |
| `AGENTS.md` | Reglas del arquitecto para el agente (incluye la **regla de dependencia**). Claude Code lo lee desde `CLAUDE.md`; OpenCode y Codex lo leen directamente |
| `test/dominio/` | Etapa 1. Pruebas de `RangoHorario`, `Cita` y `Agenda`. No usan base de datos |
| `test/aplicacion/` | Etapa 2. Pruebas de los casos de uso `AgendarCita` y `CancelarCita` con dobles de prueba (`test/fakes.ts`) |
| `test/infraestructura/` | Etapas 3 y 5. Una misma «prueba de contrato» que cada repositorio debe pasar, y la prueba de intercambio |
| `test/arquitectura.test.ts` | Etapa 4. Vigila la **regla de dependencia**: no se edita |
| `casos/` | Cinco casos para el caso práctico (un sistema por equipo) |
| `docs/` | Plantillas: ADR, escenario de calidad y diagramas |

## Estructura implementada
```
src/
├── domain/             # Reglas del negocio puras: rango-horario, cita, agenda, errores, agenda-repositorio (puerto)
├── application/        # Casos de uso: agendar-cita, cancelar-cita, puertos (EventBus, GeneradorId)
├── infrastructure/     # Adaptadores: persistence/, messaging/, http/, id/
└── composicion.ts      # Único lugar que elige los adaptadores: crearApp({ tipo: "memoria" | "json" })
```

## Guía para revisar el pull request
Estos son tres puntos sugeridos para la revisión; los comentarios todavía deben dejarse en el PR:
1. Verificar que `RangoHorario.seCruzaCon` permite citas contiguas, pero rechaza intervalos con tiempo compartido.
2. Comprobar que `AgendaRepositorioMemoria` devuelve copias y no expone su estado interno.
3. Confirmar que cambiar de memoria a JSON solo requiere elegir otra opción en `composicion.ts`.

> Nunca compartas claves ni datos personales con un agente. Este repositorio solo contiene datos inventados.

Material de clase. Nada de lo que hay aquí acredita que la sesión se haya impartido.
